export default {
  nextStep: () => ({
    type: 'NEXT'
  }),
  prevStep: () => ({
    type: 'PREVIOUS'
  }),
  setLocation: (routerState: any, action = 'PUSH') => ({
    type: 'LOCATION_CHANGE',
    router: {
      action,
      location: routerState
    }
  })
}
