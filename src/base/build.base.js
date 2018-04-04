require('./styles/style')
require('./build.base.dll')

require('./scripts/under-helper')

import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import {version} from '../../package.json'

Raven
  .config('http://fbb9f127452f409489dfa91bd6ee6bd4@sentry.5x5x.com/3', {
    release: version
  })
  .addPlugin(RavenVue, Vue)
  .install();
