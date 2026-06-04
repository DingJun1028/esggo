/** Genkit client stub */
export const genkitClient = {
  invoke: async (flowName: string, data: unknown) => {
    console.warn(`[genkitClient stub] Invoked flow: ${flowName}`, data);
    return { result: null, stubbed: true };
  },
};
