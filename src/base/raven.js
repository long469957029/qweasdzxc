import RavenVue from 'raven-js/plugins/vue';
import {version} from '../../package.json'

if (process.env.NODE_ENV === 'production') {
  Raven
    .config('http://fbb9f127452f409489dfa91bd6ee6bd4@sentry.5x5x.com/3', {
      release: version,
      environment: process.env.ENVIRONMENT
    })
    .addPlugin(RavenVue, Vue)
    .install();
}
