import type { DModelsServiceId } from '~/common/stores/llms/modelsservice.types';
import { InlineError } from '~/common/components/InlineError';
import { SetupFormRefetchButton } from '~/common/components/forms/SetupFormRefetchButton';
import { useToggleableBoolean } from '~/common/util/hooks/useToggleableBoolean';

import { ApproximateCosts } from '../ApproximateCosts';
import { useLlmUpdateModels } from '../../llm.client.hooks';
import { useServiceSetup } from '../useServiceSetup';

import { ModelVendorNexusAI } from './nexusai.vendor';



export function NexusAiServiceSetup(props: { serviceId: DModelsServiceId }) {

  // external state
  const { service, serviceAccess, serviceHasBackendCap, serviceHasLLMs, updateSettings } =
    useServiceSetup(props.serviceId, ModelVendorNexusAI);

  // derived state
  const { oaiKey, oaiOrg, oaiHost, heliKey, moderationCheck } = serviceAccess;
  const needsUserKey = !serviceHasBackendCap;

  const keyValid = true; //isValidOpenAIApiKey(oaiKey);
  const keyError = (/*needsUserKey ||*/ !!oaiKey) && !keyValid;
  const shallFetchSucceed = oaiKey ? keyValid : !needsUserKey;

  // fetch models
  const { isFetching, refetch, isError, error } =
    useLlmUpdateModels(!serviceHasLLMs && shallFetchSucceed, service);

  return <>

    <ApproximateCosts serviceId={service?.id} />

    <SetupFormRefetchButton refetch={refetch} disabled={isFetching} error={isError} loading={isFetching} />

    {isError && <InlineError error={error} />}

  </>;
}
