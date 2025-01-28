import { OpenAIIcon } from '~/common/components/icons/vendors/OpenAIIcon';
import { apiAsync } from '~/common/util/trpc.client';

import type { IModelVendor } from '../IModelVendor';
import type { OpenAIAccessSchema } from '../../server/openai/openai.router';
import { NexusAiServiceSetup } from './NexusAiServiceSetup';


// special symbols
// export const isValidOpenAIApiKey = (apiKey?: string) => !!apiKey && apiKey.startsWith('sk-') && apiKey.length > 40;

export interface DOpenAIServiceSettings {
  oaiKey: string;
  oaiOrg: string;
  oaiHost: string;  // use OpenAI-compatible non-default hosts (full origin path)
  heliKey: string;  // helicone key (works in conjunction with oaiHost)
  moderationCheck: boolean;
}

export const ModelVendorNexusAI: IModelVendor<DOpenAIServiceSettings, OpenAIAccessSchema> = {
  id: 'nexusai',
  name: 'NexusAI',
  displayRank: 1,
  location: 'cloud',
  instanceLimit: 5,
  hasBackendCapKey: 'hasLlmNexusAI',

  // components
  Icon: OpenAIIcon,
  ServiceSetupComponent: NexusAiServiceSetup,

  // functions
  getTransportAccess: (partialSetup): OpenAIAccessSchema => ({
    dialect: 'nexusai',
    oaiKey: '',
    oaiOrg: '',
    oaiHost: '',
    heliKey: '',
    moderationCheck: false,
    ...partialSetup,
  }),

  // List Models
  rpcUpdateModelsOrThrow: async (access) => await apiAsync.llmOpenAI.listModels.query({ access }),

};
