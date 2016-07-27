///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';
import config from 'app/core/config';
import alertDef from './alert_def';

export class AlertListCtrl {

  alerts: any;
  filter = {
    ok: false,
    warn: false,
    critical: false,
    acknowleged: false
  };

  /** @ngInject */
  constructor(private backendSrv, private $route) {
    _.each($route.current.params.state, state => {
      this.filter[state.toLowerCase()] = true;
    });

    this.loadAlerts();
  }

  updateFilter() {
    var stats = [];
    this.filter.ok && stats.push('OK');
    this.filter.warn && stats.push('Warn');
    this.filter.critical && stats.push('critical');

    this.$route.current.params.state = stats;
    this.$route.updateParams();
  }

  loadAlerts() {
    var stats = [];

    this.filter.ok && stats.push('OK');
    this.filter.warn && stats.push('Warn');
    this.filter.critical && stats.push('critical');

    var params = {
      state: stats
    };

    this.backendSrv.get('/api/alerts', params).then(result => {
      this.alerts = _.map(result, alert => {
        alert.severityClass = alertDef.getSeverityIconClass(alert.severity);
        return alert;
      });
    });
  }
}

coreModule.controller('AlertListCtrl', AlertListCtrl);
