import packageJSON from '#scout/runner/package.json';


const PROJECT_NAME = packageJSON['project_name'];
const VERSION = packageJSON['version'];
const NAME = packageJSON['name'];

export { PROJECT_NAME, VERSION, NAME };
