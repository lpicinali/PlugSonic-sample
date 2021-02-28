import styled from "styled-components"

export const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`

export const Alert = styled.div`
  width: 90%;
  height: 90%;

  display: flex;

  align-items: center;
  justify-content: center;
  text-align: center;

  border: dashed thin #666;
  border-radius: 20px;
`

export const AlertBody = styled.div`
  margin: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

export const Asset = styled.div`
  padding: 40px;
  text-align: left;
  
  header {
    font-size: smaller;
    font-weight: lighter;

    color: gray;
  }

  h1 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  p {
    max-height: 400px;
    overflow: hidden;
  }
`
