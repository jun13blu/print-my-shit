import React, { Component } from 'react'
import { Header, Container, Segment, Button, List } from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import 'semantic-ui-css/semantic.min.css'

class App extends Component {
  state = { windowHeight: 0, files: [] }

  componentDidMount() {
    this.updateWindowHeight()
    window.addEventListener('resize', this.updateWindowHeight)
  }

  onDrop = (a, r) =>
    this.setState({ files: [...this.state.files, ...a] }, () =>
      console.log(this.state.files)
    )

  updateWindowHeight = () =>
    this.setState({
      height: window.innerHeight
    })

  upload = () =>
    axios
      .post(
        'https://script.google.com/a/siswa.um.edu.my/macros/s/AKfycbxS1M8Tua_kHUw8AI_XN7RQa79VOnUJoZ0SgzLgZYlzcgbq2wE/exec',
        {
          text: 'hey'
        },
        { 'Access-Control-Allow-Origin': '*' }
      )
      .then(res => console.log(res))

  render() {
    return (
      <div className="App">
        <Segment basic>
          <Container textAlign="center">
            <Header as="h1">Print My Shit</Header>
            <Segment inverted color="black">
              <Dropzone
                onDrop={this.onDrop}
                style={{
                  width: '100%',
                  height: this.state.height - 160
                }}
              >
                {this.state.files.length ? (
                  <List>
                    {this.state.files.map((file, i) => (
                      <List.Item key={`${i}_${file.name}`}>
                        {file.name}
                      </List.Item>
                    ))}
                  </List>
                ) : (
                  'Drop files here.'
                )}
              </Dropzone>
            </Segment>
            <Button onClick={this.upload}>Upload</Button>
          </Container>
        </Segment>
      </div>
    )
  }
}

export default App
