import React, { Component } from 'react'
import {
  Header,
  Container,
  Segment,
  Button,
  Modal,
  Input,
  Icon,
  Grid
} from 'semantic-ui-react'
import Dropzone from 'react-dropzone'
import 'semantic-ui-css/semantic.min.css'

class App extends Component {
  state = { windowHeight: 0, files: [], name: '', open: false, loading: false }

  componentDidMount() {
    this.updateWindowHeight()
    window.addEventListener('resize', this.updateWindowHeight)
  }

  onDrop = (a, r) =>
    this.setState({
      files: [
        ...this.state.files,
        ...a.map(file => ({ data: file, page: '', copies: '' }))
      ]
    })

  updateWindowHeight = () =>
    this.setState({
      height: window.innerHeight
    })

  upload = () =>
    this.state.files.forEach(file => {
      const reader = new FileReader()
      reader.readAsDataURL(file.data)
      reader.onloadend = e =>
        fetch(
          'https://script.google.com/macros/s/AKfycbyfak4cmz7_eF10Sor2nuXFmbSQc0Kxw5WvkOxKmQ1v-hFLX8E/exec',
          {
            method: 'post',
            body: JSON.stringify({
              file: e.target.result,
              name: file.data.name,
              user: this.state.name.trim(),
              page: file.page,
              copies: file.copies
            })
          }
        )
          .then(res => res.json())
          .then(data => console.log(data))
          .then(() => this.setState({ name: '', open: false, loading: false }))
    })

  setName = (e, { value }) => this.setState({ name: value })

  setPageNum = (e, { id, value }) =>
    this.setState({
      files: this.state.files.map(
        (file, i) =>
          i.toString() === id.toString() ? { ...file, page: value } : file
      )
    })

  setCopies = (e, { id, value }) =>
    this.setState({
      files: this.state.files.map(
        (file, i) =>
          i.toString() === id.toString() ? { ...file, copies: value } : file
      )
    })

  delete = i =>
    this.setState({
      files: this.state.files.filter((file, index) => index !== i)
    })

  trigger = () => this.setState({ open: !this.state.open })

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
                  height: this.state.height - 160 || 0
                }}
                disableClick
                ref={node => (this.dropzoneRef = node)}
              >
                {this.state.files.length ? (
                  <Grid container>
                    {this.state.files.map((file, i) => (
                      <Grid.Row key={`${i}_${file.data.name}`}>
                        <Grid.Column textAlign="left" width={10}>
                          <Icon
                            onClick={() => this.delete(i)}
                            name="remove"
                            link
                          />
                          {file.data.name}
                        </Grid.Column>
                        <Grid.Column width={3}>
                          <Input
                            id={i}
                            fluid
                            inverted
                            size="mini"
                            placeholder="Page number..."
                            onChange={this.setPageNum}
                          />
                        </Grid.Column>
                        <Grid.Column width={3}>
                          <Input
                            id={i}
                            fluid
                            inverted
                            size="mini"
                            placeholder="No. of copies..."
                            onChange={this.setCopies}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    ))}
                  </Grid>
                ) : (
                  'Drop files here.'
                )}
              </Dropzone>
            </Segment>
            <Button onClick={() => this.dropzoneRef.open()}>Upload</Button>
            <Button
              onClick={this.trigger}
              disabled={this.state.files.length === 0}
              color="green"
            >
              Print My Shit!
            </Button>
            <Modal
              size="mini"
              open={this.state.open}
              onClose={this.trigger}
              closeIcon
              closeOnDimmerClick
            >
              <Modal.Header>Enter your name</Modal.Header>
              <Modal.Content>
                <Segment basic loading={this.state.loading}>
                  <Input
                    fluid
                    transparent
                    placeholder="Name..."
                    onChange={this.setName}
                  />
                </Segment>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  onClick={() => this.setState({ loading: true }, this.upload)}
                  disabled={
                    this.state.name.trim().length === 0 || this.state.loading
                  }
                >
                  Confirm
                </Button>
              </Modal.Actions>
            </Modal>
          </Container>
        </Segment>
      </div>
    )
  }
}

export default App
