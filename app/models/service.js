import Resource from 'ember-api-store/models/resource';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Util from 'ui/utils/util';

export default Resource.extend({
  intl: service(),
  scope: service(),

  canEditYaml: true,

  displayKind: computed('intl.locale', 'kind', function() {
    const intl = get(this, 'intl');

    if ( get(this, 'kind') === 'LoadBalancer' ) {
      return intl.t('model.service.displayKind.loadBalancer');
    } else {
      return intl.t('model.service.displayKind.generic');
    }
  }),

  proxyEndpoints: computed('labels', function(){
    const parts = []
    const labels = get(this, 'labels');
    if ( labels && labels['kubernetes.io/cluster-service'] === 'true' ) {
      (get(this, 'ports') || []).forEach((port) => {
        const linkEndpoint = `${location.protocol}//${location.host}/k8s/clusters/${get(this, 'scope.currentCluster.id')}/api/v1/namespaces/${get(this, 'namespaceId')}/services/${get(port, 'targetPort')}:${get(this, 'name')}:/proxy/`;
        parts.push({
          linkEndpoint: linkEndpoint,
          displayEndpoint: '/index.html',
          protocol: location.protocol.substr(0, location.protocol.length -1),
          isTcpish: true,
        });
      });
    }
    return parts;
  }),
});
