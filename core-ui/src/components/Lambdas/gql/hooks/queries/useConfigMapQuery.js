import { useState, useEffect } from 'react';
import { useNotification } from 'react-shared';
import { useQuery } from '@apollo/react-hooks';

import { GET_CONFIG_MAP } from 'components/Lambdas/gql/queries';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_QUERIES } from 'components/Lambdas/constants';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

export const useConfigMapQuery = ({ name, namespace }) => {
  const [cmData, setCmData] = useState({});
  const notificationManager = useNotification();

  const { data, error, loading } = useQuery(GET_CONFIG_MAP, {
    variables: {
      name,
      namespace,
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (
      data &&
      data.configMap &&
      data.configMap.json &&
      data.configMap.json.data
    ) {
      setCmData(data.configMap.json.data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const errorToDisplay = extractGraphQlErrors(error);

      const message = formatMessage(GQL_QUERIES.CONFIG_MAP.ERROR_MESSAGE, {
        configMapName: name,
        error: errorToDisplay,
      });

      notificationManager.notifyError({
        content: message,
        autoClose: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return { cmData, error, loading };
};
