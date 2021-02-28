import React from "react"

import { Container, Img, Disclaimer } from "./style"

const Home = () => (
  <Container>
    <Img src="logo.png" alt="The Pluggy Project"/>
    <Disclaimer>Although it may work on any browser, please note that Pluggy Editor
      requires the most recent version of the Web Audio API and is
      developed and tested on Google Chrome only.</Disclaimer>
  </Container>
)

export default Home
