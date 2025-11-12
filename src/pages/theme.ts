import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        talento:{
            "900": {value: '#12131b'},
            "400": {value: '#1b1c29'},
            "100": {value: '#c6c6c6'},
        },
        button:{
            "cta": {value: '#fba931'},
            "default": {value: '#fff'},
            "gray": {value: '#DFDFDF'},
            "danger": {value: '#FF4040'},
        },
        orange:{
            "900": { value: "#fba931"}
        }
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)