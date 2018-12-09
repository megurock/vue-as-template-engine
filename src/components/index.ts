import HelloWorld from './HelloWorld.vue'

declare const window: any

const install = function(Vue) {
  Vue.component('HelloWorld', HelloWorld)
}

if (typeof window !== 'undefined' && window.Vue) {
  console.log('Install')
  install(window.Vue)
}

export default { install }
