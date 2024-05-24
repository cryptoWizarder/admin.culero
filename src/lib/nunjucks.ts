import nunjucks from 'nunjucks';

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/views'));

export default env;
