import apiErrorLogConfigs from "./api-error-log/apiErrorLogConfigs";
import extendedApiConfigs from "./extended-api/extendedApiConfigs";
import GameListConfigs from "./game-list/GameListConfigs";
import nativeApiConfigs from "./native-api/nativeApiConfigs";
import VendorGameListConfigs from "./vendor-game-list/VendorGameListConfig";


const developerConfigs = [
  nativeApiConfigs,
  extendedApiConfigs,
  apiErrorLogConfigs,
  VendorGameListConfigs,
  GameListConfigs
  
];

export default developerConfigs;
