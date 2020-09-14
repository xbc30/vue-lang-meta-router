import { isUndefined, isFunction } from './is-type'

// MetaInfo Class for metaInfo plugin
class MetaInfo {}

// Install method of the MetaInfo plugin
MetaInfo.install = function (Vue) {
    if (Vue.__vuemeta_installed) {
        return
    }
    Vue.__metainfo_installed = true
    // for all components
    Vue.mixin(createMixin())
}

// automatic install
if (!isUndefined(window) && !isUndefined(window.Vue)) {
    /* istanbul ignore next */
    MetaInfo.install(window.Vue)
}

function createMixin() {
    return {
        beforeCreate() {
            const $options = this.$options
            if ($options['metaInfo']) {
                if (isFunction($options['metaInfo'])) {
                    $options.computed = $options.computed || {}
                    $options.computed.$metaInfo = $options['metaInfo']
    
                    this.$on('hook:created', function () {
                        document.title = this.$metaInfo.title
                        this.$watch('$metaInfo', function () {
                            document.title = this.$metaInfo.title
                        })
                    })
                } else {
                    document.title = $options['metaInfo'].title
                }
            }
        }
    }
}

export { MetaInfo as VueMetaInfo }