const makeExtractor = (extract) => (typeof extract === 'function' ? extract : (req) => req[extract]);

export default makeExtractor;
