import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
        user: {} as User,
        isBack: false,
    }
  },
})

export const useMetadataStore = defineStore('metadata', {
  state: () => {
    return {
        id: '' as string
    }
  }
})