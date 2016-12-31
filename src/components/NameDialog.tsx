import React from 'react';
import ReactDOM from 'react-dom';
import { Dialog } from 'react-toolbox/lib/dialog';
import { Input } from 'react-toolbox/lib/input';
import { ProgressBar } from 'react-toolbox/lib/progress_bar';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import theme from './NameDialog.css';

interface NameDialogProps {
  CurrentUserQuery: any;
  data: any;
  createUser: (name: string) => any;
}

interface NameDialogState {
  inputText: string;
  error: string;
  waiting: boolean;
}

class NameDialog extends React.Component<NameDialogProps, NameDialogState> {
  constructor() {
    super();

    this.state = {
      inputText: '',
      error: '',
      waiting: false
    };
  }

  input: any = null;

  handleChange = (newText: string) => {
    this.setState({ ...this.state, inputText: newText, error: '' });
  }

  onSubmit = () => {
    this.setState({ ...this.state, waiting: true });
    this.props.createUser(this.state.inputText.trim())
      .then(({ data }: any) => {
        if (data.createUser.error) {
          this.setState({ ...this.state, waiting: false, error: data.createUser.error })
        }
      });

    this.input.getWrappedInstance().blur();
  }

  render() {
    return (
      <Dialog
        title={`Let's go. #notmyyear`}
        active={!this.props.CurrentUserQuery.loading && !this.props.CurrentUserQuery.currentUser}
        actions={[{
          label: this.state.waiting ? <ProgressBar type='circular' theme={theme} /> : 'GO!',
          disabled: !this.state.inputText || !!this.state.error || this.state.waiting,
          onClick: this.onSubmit,
        } as any]}
      >
        <Input
          ref={(e:any) => this.input = e}
          label='Choose a name'
          value={this.state.inputText}
          error={this.state.error}
          disabled={this.state.waiting}
          onChange={(inputText: string) => this.setState({ ...this.state, inputText, error: '' })}
          onFocus={() => this.setState({ ...this.state, error: '' })}
          onKeyPress={(event: React.KeyboardEvent<this>) => event.key === 'Enter' ? this.onSubmit() : undefined}
        />
      </Dialog>
    );
  }
}

const CurrentUser = gql`
  query CurrentUser {
    currentUser {
      id
      admin
    }
  }
`

export const withCurrentUser = graphql(CurrentUser, {
  props: ({ownProps, data}) => ({...ownProps, currentUser: data.currentUser})
});

const CreateUser = gql`
  mutation CreateUser($name: String!) {
    createUser(name: $name) {
      user {
        id
        admin
      }
      error
    }
  }
`
export default compose(
  graphql(CurrentUser, {name: 'CurrentUserQuery'}),
  graphql(CreateUser, {
    props: ({ mutate }) => ({
      createUser: (name: string) => mutate({
        variables: { name },
        updateQueries: {
          CurrentUser: (prev: any, { mutationResult }: any) => {
            return mutationResult.data.createUser.user
              ? { ...prev, currentUser: mutationResult.data.createUser.user }
              : prev
          }
      }
      })
    })
  }),
)(NameDialog);