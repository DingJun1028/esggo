/** BoostSpace client stub */
export const boostSpaceClient = {
  request: async (opts: { apiName: string; data: unknown }) => {
    console.warn(`[boostSpaceClient stub] Request: ${opts.apiName}`, opts.data);
    return { result: null, stubbed: true };
  },
};
