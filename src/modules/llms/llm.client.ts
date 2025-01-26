import { sendGAEvent } from '@next/third-parties/google';

import { hasGoogleAnalytics } from '~/common/components/GoogleAnalytics';

import type { DModelsService, DModelsServiceId } from '~/common/stores/llms/modelsservice.types';
import { DLLM, LLM_IF_HOTFIX_NoTemperature, LLM_IF_OAI_Chat, LLM_IF_OAI_Fn } from '~/common/stores/llms/llms.types';
import { applyModelParameterInitialValues, FALLBACK_LLM_PARAM_TEMPERATURE } from '~/common/stores/llms/llms.parameters';
import { isModelPricingFree } from '~/common/stores/llms/llms.pricing';
import { llmsStoreActions } from '~/common/stores/llms/store-llms';

import type { ModelDescriptionSchema } from './server/llm.server.types';
import { findServiceAccessOrThrow } from './vendors/vendor.helpers';


// LLM Model Updates Client Functions

export async function llmsUpdateModelsForServiceOrThrow(serviceId: DModelsServiceId, keepUserEdits: boolean): Promise<{ models: ModelDescriptionSchema[] }> {

  // get the access, assuming there's no client config and the server will do all
  const { service, vendor, transportAccess } = findServiceAccessOrThrow(serviceId);

  // fetch models
  // const data = await vendor.rpcUpdateModelsOrThrow(transportAccess);

  const data: { models: ModelDescriptionSchema[] } = {
    "models": [
      {
        "id": "nexus-ai-agent",
        "label": "Nexus Ai Agent",
        "created": 1677649963,
        "updated": 1677649963,
        "description": "Latest gpt-4o snapshot from November 20th, 2024.",
        "contextWindow": 128000,
        "interfaces": [
          "oai-chat",
          "oai-chat-vision",
          "oai-chat-fn",
          "oai-chat-json",
          "oai-prompt-caching"
        ],
        "maxCompletionTokens": 16384,
        "trainingDataCutoff": "Oct 2023",
        "benchmark": {
          "cbaElo": 1265
        },
        "chatPrice": {
          "input": 2.5,
          "output": 10,
          "cache": {
            "cType": "oai-ac",
            "read": 1.25
          }
        }
      },
      {
        "id": "o1-preview-2024-09-12",
        "label": "КУКУ",
        "created": 1677649963,
        "updated": 1677649963,
        "description": "Latest o1 model snapshot. This model takes longer to run and does not support streaming. New reasoning model for complex tasks that require broad general knowledge.",
        "contextWindow": 128000,
        "interfaces": [
          "oai-chat",
          "oai-chat-reasoning",
          "oai-prompt-caching",
          "hotfix-strip-images",
          "hotfix-sys0-to-usr0"
        ],
        "maxCompletionTokens": 32768,
        "trainingDataCutoff": "Oct 2023",
        "benchmark": {
          "cbaElo": 1335
        },
        "chatPrice": {
          "input": 15,
          "output": 60,
          "cache": {
            "cType": "oai-ac",
            "read": 7.5
          }
        }
      },
      {
        "id": "o1-mini-2024-09-12",
        "label": "o1 Mini (2024-09-12)",
        "created": 1677649963,
        "updated": 1677649963,
        "description": "Latest o1-mini model snapshot. Fast, cost-efficient reasoning model tailored to coding, math, and science use cases.",
        "contextWindow": 128000,
        "interfaces": [
          "oai-chat",
          "oai-chat-reasoning",
          "oai-prompt-caching",
          "hotfix-strip-images",
          "hotfix-sys0-to-usr0"
        ],
        "maxCompletionTokens": 65536,
        "trainingDataCutoff": "Oct 2023",
        "benchmark": {
          "cbaElo": 1314
        },
        "chatPrice": {
          "input": 3,
          "output": 12,
          "cache": {
            "cType": "oai-ac",
            "read": 1.5
          }
        }
      },
      {
        "id": "o1-2024-12-17",
        "label": "o1 (2024-12-17)",
        "created": 1677649963,
        "updated": 1677649963,
        "description": "Latest o1 model.",
        "contextWindow": 200000,
        "interfaces": [
          "oai-chat",
          "oai-chat-fn",
          "oai-chat-json",
          "oai-chat-vision",
          "oai-chat-reasoning",
          "oai-prompt-caching",
          "hotfix-no-stream"
        ],
        "parameterSpecs": [
          {
            "paramId": "llmVndOaiReasoningEffort"
          }
        ],
        "maxCompletionTokens": 100000,
        "trainingDataCutoff": "Oct 2023",
        "benchmark": {
          "cbaElo": 1336
        },
        "chatPrice": {
          "input": 15,
          "output": 60,
          "cache": {
            "cType": "oai-ac",
            "read": 7.5
          }
        }
      },
      {
        "id": "gpt-4o-mini-2024-07-18",
        "label": "GPT-4o Mini (2024-07-18)",
        "created": 1677649963,
        "updated": 1677649963,
        "description": "Affordable model for fast, lightweight tasks. GPT-4o Mini is cheaper and more capable than GPT-3.5 Turbo.",
        "contextWindow": 128000,
        "interfaces": [
          "oai-chat",
          "oai-chat-vision",
          "oai-chat-fn",
          "oai-chat-json",
          "oai-prompt-caching"
        ],
        "maxCompletionTokens": 16384,
        "trainingDataCutoff": "Oct 2023",
        "benchmark": {
          "cbaElo": 1272
        },
        "chatPrice": {
          "input": 0.15,
          "output": 0.6,
          "cache": {
            "cType": "oai-ac",
            "read": 0.075
          }
        }
      },
      {
        "id": "gpt-4o-2024-08-06",
        "label": "GPT-4o (2024-08-06)",
        "created": 1677649963,
        "updated": 1677649963,
        "description": "First snapshot that supports Structured Outputs. gpt-4o currently points to this version.",
        "contextWindow": 128000,
        "interfaces": [
          "oai-chat",
          "oai-chat-vision",
          "oai-chat-fn",
          "oai-chat-json",
          "oai-prompt-caching"
        ],
        "maxCompletionTokens": 16384,
        "trainingDataCutoff": "Oct 2023",
        "benchmark": {
          "cbaElo": 1264
        },
        "chatPrice": {
          "input": 2.5,
          "output": 10,
          "cache": {
            "cType": "oai-ac",
            "read": 1.25
          }
        },
        "hidden": true
      },
      {
        "id": "gpt-4o-2024-05-13",
        "label": "GPT-4o (2024-05-13)",
        "created": 1677649963,
        "updated": 1677649963,
        "description": "Original gpt-4o snapshot from May 13, 2024.",
        "contextWindow": 128000,
        "interfaces": [
          "oai-chat",
          "oai-chat-vision",
          "oai-chat-fn",
          "oai-chat-json"
        ],
        "maxCompletionTokens": 4096,
        "trainingDataCutoff": "Oct 2023",
        "benchmark": {
          "cbaElo": 1285
        },
        "chatPrice": {
          "input": 5,
          "output": 15
        },
        "hidden": true
      },
      {
        "id": "gpt-4-turbo-2024-04-09",
        "label": "GPT-4 Turbo (2024-04-09)",
        "created": 1677649963,
        "updated": 1677649963,
        "description": "GPT-4 Turbo with Vision model. Vision requests can now use JSON mode and function calling. gpt-4-turbo currently points to this version.",
        "contextWindow": 128000,
        "interfaces": [
          "oai-chat",
          "oai-chat-vision",
          "oai-chat-fn",
          "oai-chat-json"
        ],
        "maxCompletionTokens": 4096,
        "trainingDataCutoff": "Dec 2023",
        "benchmark": {
          "cbaElo": 1257
        },
        "chatPrice": {
          "input": 10,
          "output": 30
        }
      },
      {
        "id": "gpt-4-0125-preview",
        "label": "GPT-4 Turbo (0125)",
        "created": 1677649963,
        "updated": 1677649963,
        "description": "GPT-4 Turbo preview model intended to reduce cases of \"laziness\" where the model doesn't complete a task.",
        "contextWindow": 128000,
        "interfaces": [
          "oai-chat",
          "oai-chat-fn",
          "oai-chat-json"
        ],
        "maxCompletionTokens": 4096,
        "trainingDataCutoff": "Dec 2023",
        "benchmark": {
          "cbaElo": 1251
        },
        "chatPrice": {
          "input": 10,
          "output": 30
        },
        "hidden": true
      },
      {
        "id": "gpt-4-1106-preview",
        "label": "GPT-4 Turbo (1106)",
        "created": 1677649963,
        "updated": 1677649963,
        "description": "GPT-4 Turbo preview model featuring improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more.",
        "contextWindow": 128000,
        "interfaces": [
          "oai-chat",
          "oai-chat-fn",
          "oai-chat-json"
        ],
        "maxCompletionTokens": 4096,
        "trainingDataCutoff": "Apr 2023",
        "benchmark": {
          "cbaElo": 1251
        },
        "chatPrice": {
          "input": 10,
          "output": 30
        },
        "hidden": true
      },
    ]
  }

  // update the global models store
  llmsStoreActions().setLLMs(
    data.models.map((model, index) => ({ ...model, label: index ? (model.label + ' Coming Soon') : model.label }))
      .map(model => _createDLLMFromModelDescription(model, service)),
    service.id,
    true,
    keepUserEdits,
  );

  // figure out which vendors are actually used and useful
  hasGoogleAnalytics && sendGAEvent('event', 'app_models_updated', {
    app_models_source_id: service.id,
    app_models_source_label: service.label,
    app_models_updated_count: data.models.length || 0,
    app_models_vendor_id: vendor.id,
    app_models_vendor_label: vendor.name,
  });

  // return the fetched models
  return data;
}

const _fallbackInterfaces = [LLM_IF_OAI_Chat, LLM_IF_OAI_Fn];

function _createDLLMFromModelDescription(d: ModelDescriptionSchema, service: DModelsService): DLLM {

  // null means unknown contenxt/output tokens
  const contextTokens = d.contextWindow || null;
  const maxOutputTokens = d.maxCompletionTokens || (contextTokens ? Math.round(contextTokens / 2) : null);
  const llmResponseTokensRatio = d.maxCompletionTokens ? 1 : 1 / 4;
  const llmResponseTokens = maxOutputTokens ? Math.round(maxOutputTokens * llmResponseTokensRatio) : null;

  // create the object
  const dllm: DLLM = {
    id: `${service.id}-${d.id}`,

    // editable properties
    label: d.label,
    created: d.created || 0,
    updated: d.updated || 0,
    description: d.description,
    hidden: !!d.hidden,

    // hard properties
    contextTokens,
    maxOutputTokens,
    trainingDataCutoff: d.trainingDataCutoff,
    interfaces: d.interfaces?.length ? d.interfaces : _fallbackInterfaces,
    benchmark: d.benchmark,
    // pricing: undefined, // set below, since it needs some adaptation

    // parameters system (spec and initial values)
    parameterSpecs: d.parameterSpecs?.length ? d.parameterSpecs : [],
    initialParameters: {
      llmRef: d.id,
      llmTemperature: d.interfaces.includes(LLM_IF_HOTFIX_NoTemperature) ? null : FALLBACK_LLM_PARAM_TEMPERATURE,
      llmResponseTokens: llmResponseTokens,
    },

    // references
    sId: service.id,
    vId: service.vId,

    // user edited properties: not set
    // userLabel: undefined,
    // userHidden: undefined,
    // userParameters: undefined,
  };

  // set other params from spec
  if (d.parameterSpecs)
    applyModelParameterInitialValues(d.parameterSpecs.map(p => p.paramId), dllm.initialParameters, false);

  // set the pricing
  if (d.chatPrice && typeof d.chatPrice === 'object') {
    dllm.pricing = {
      chat: {
        ...d.chatPrice,
        // compute the free status
        _isFree: isModelPricingFree(d.chatPrice),
      },
    };
  }

  return dllm;
}
