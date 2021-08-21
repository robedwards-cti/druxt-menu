const DruxtMenuStore = ({ store }) => {
  if (typeof store === 'undefined') {
    throw new TypeError('Vuex store not found.')
  }

  /**
   * @namesapce
   */
  const namespace = 'druxtMenu'

  /**
   * The druxtMenu Vuex module.
   *
   * Provides a Vuex state object, mutations, actions and getters for
   * interacting Drupal JSON:API Menu Items.
   *
   * @name druxtMenu
   * @module druxtMenu
   */
  const module = {
    namespaced: true,

    /**
     * Vuex State object.
     */
    state: () => ({
      entities: {}
    }),

    /**
     * Vuex Mutations.
     */
    mutations: {
      /**
       * @name addEntities
       * @mutator {object} addEntities=entities Adds specified Drupal JSON:API Menu Items data to the Vuex state object.
       * @param {State} state - The Vuex State object.
       * @param {object} entities - The Drupal JSON:API Menu Item entities.
       *
       * @example @lang js
       * this.$store.commit('druxtMenu/addEntities', entities)
       */
      addEntities (state, entities) {
        for (const index in entities) {
          const entity = entities[index]
          state.entities[entity.id] = entity
        }
      }
    },

    /**
     * Vuex Actions.
     */
    actions: {
      /**
       * Get menu by name.
       *
       * - Fetches the menu items from the JSON:API endpoint.
       * - Commits the menu items to the Vuex state object.
       *
       * @name get
       * @action get=entities
       * @param {object} app - The Nuxt app context.
       * @param {string|object} context - The Menu name or context object.
       *
       * @example @lang js
       * await this.$store.dispatch('druxtMenu/get', { name: 'main' })
       */
      async get ({ commit, rootState }, context) {
        const { name, settings } = typeof context === 'object'
          ? context
          : { name: context }
        // Get the route prefix from the druxt-router store.
        const prefix = rootState.druxtRouter.route.prefix
        const { entities } = (await this.$druxtMenu.get(name, settings, prefix)) || {}

        commit('addEntities', entities)
      }
    },

    /**
     * Vuex Getters.
     */
    getters: {
      /**
       * Get entities by filter.
       *
       * @name getEntitiesByFilter
       * @type {Function}
       * @param {Function} filter - A `filter()` method compatible function.
       *
       * @example @lang js
       * const items = this.$store.getters.getEntitiesByFilter(key => {
       *   return this.entities[key].attributes.menu_name === 'main'
       * })
       */
      getEntitiesByFilter: state => filter => {
        const keys = Object.keys(state.entities).filter(key => filter(key))
        if (!keys.length) return {}

        return Object.assign(
          ...keys.map(key => ({ [key]: state.entities[key] }))
        )
      }
    }
  }

  store.registerModule(namespace, module, {
    preserveState: Boolean(store.state[namespace])
  })
}

export { DruxtMenuStore }

/**
 * The Vuex State object.
 *
 * @typedef {object} State
 * @property {object} entities - The Drupal JSON:API Menu Item entities.
 */
