import algoliaSearch from "algoliasearch";

const ALGOLIA_APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = process.env.REACT_APP_ALGOLIA_API_KEY;

const algolia = algoliaSearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const listingIndex = algolia.initIndex(
  process.env.REACT_APP_ALGOLIA_LISTING_INDEX
);

listingIndex.setSettings({
  searchableAttributes: ["name", "type", "services", "strains"]
});

// const brandIndex = algolia.initIndex(process.env.REACT_APP_ALGOLIA_BRAND_INDEX);

export default class AlgoliaApi {
  static geoSearch(nw, se, curentLocation, filters) {
    const facets = Object.keys(filters);
    const facetFilters = facets
      .map(key => {
        return filters[key].map(service => {
          return `${key}:${service}`;
        });
      })
      .filter(i => i.length > 0);
    const stringFacets = `${JSON.stringify(facets)}`;
    const stringFacetFilters = JSON.stringify(facetFilters);
    return listingIndex
      .search("", {
        hitsPerPage: "100",
        page: "0",
        analytics: "false",
        attributesToRetrieve: "*",
        insideBoundingBox: `${nw.lat},${nw.lng},${se.lat},${se.lng}`,
        facets: `${stringFacets}`,
        facetFilters: `${stringFacetFilters}`
      })
      .then(results => {
        if (results.hits.length > 0) {
          return results.hits.map(hit => {
            return {
              id: hit.objectID,
              listing: {
                ...hit,
                id: hit.objectID,
                location: { lat: hit._geoloc.lat, lon: hit._geoloc.lng }
              },
              distance: [0] //[hit._rankingInfo.geoDistance]
            };
          });
        }

        return [];
      });
  }
  static autoCompleteSearch(input) {
    const queries = [
      {
        indexName: process.env.REACT_APP_ALGOLIA_LISTING_INDEX,
        query: input,
        params: {
          hitsPerPage: "20",
          page: "0",
          analytics: "false",
          attributesToRetrieve: "*"
        }
      },
      {
        indexName: process.env.REACT_APP_ALGOLIA_BRAND_INDEX,
        query: input,
        params: {
          hitsPerPage: "20",
          page: "0",
          analytics: "false",
          attributesToRetrieve: "*"
        }
      }
    ];
    return algolia.search(queries).then(({ results }) => {
      return results.map(result => {
        if (result.hits.length > 0) {
          let section = "";
          if (result.index === process.env.REACT_APP_ALGOLIA_LISTING_INDEX) {
            section = "Places";
          }
          if (result.index === process.env.REACT_APP_ALGOLIA_BRAND_INDEX) {
            section = "Brands";
          }
          const suggestions = result.hits.map(hit => {
            let e = {
              id: hit.objectID,
              type: hit.type,
              text: input,
              suggestion: hit.name,
              section
            };
            if (hit._geoloc) {
              e.location = { lat: hit._geoloc.lat, lon: hit._geoloc.lng };
            }
            return e;
          });
          return {
            section,
            suggestions
          };
        }
        return null;
      });
    });
  }
}
