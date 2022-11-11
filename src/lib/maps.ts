export function formatMapsResponse(assetData: any, maps: any[]): any {
    const networkCodes = [...new Set(maps.map((map: any) => map.networkCode))].sort();
    const networks: {[networkCode: string]: string[]} = {};

    for(const networkCode of networkCodes) {
      const networkAddresses = maps
        .filter((map: any) => map.networkCode === networkCode)
        .map((map: any) => map.address);

      networks[networkCode + ''] = networkAddresses;
    }
    assetData.networks = networks;

    // const types = [...new Set(maps.map((map: any) => map.type))].sort();
    // const organizedMaps: {[type: string]: any[]} = {};

    // for(const type of types) {
    //   const typeMaps = maps
    //     .filter((map: any) => map.type === type)
    //     .map((map: any) => JSON.parse(map.data));

    //   organizedMaps[type + ''] = typeMaps;
    // }
    // assetData.maps = organizedMaps; 

    return assetData;
}