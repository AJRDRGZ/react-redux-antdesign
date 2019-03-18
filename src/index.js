import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Input } from 'antd';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import { Provider, connect  } from "react-redux";
import './index.css';
//import * as serviceWorker from './serviceWorker';

// initialState en el ejemplo se almacena el campo username con todas sus propiedades de Form.createFormField
const initialState = { 
    username: { 
        value: 'ajrdrgz',
        name: null,
        touched: false,
        dirty: false,
        validating: false,
        errors: null
    } 
}

// redux-reducer
function formReducer(state = initialState, action) {
    switch (action.type) {
      case 'SAVE-FIELDS':
        const { value, name, touched, dirty, validating, errors } = action.payload.username;
        return {
          ...state,
          username: {
            ...state.username,
            value,
            name,
            touched,
            dirty,
            validating,
            errors
          } 
        }
      default:
        return state;
    }
  }

// action-creator
export const saveField = fields => {
    return {
        type: 'SAVE-FIELDS',
        payload: { ...fields }
    }
};

// redux-store
const store = createStore(combineReducers( { formReducer },applyMiddleware(logger)))

// MyForm
const MyForm = (props) => {
    const { getFieldDecorator } = props.form;
    return (
      <Form layout="inline">
        <Form.Item label="Username">
          {getFieldDecorator('username', {
            rules: [{ required: true, len: 12, message: 'Usuario es requerido y debe ser de 12 caracteres!' }],
          })(<Input />)}
        </Form.Item>
      </Form>
    );
}

const mapStateToProps = state => ({
    formState: {
        username: state.formReducer.username,
    },
})

const mapDispatchToProps = dispatch => {
    return {
        sF(fields) {
            dispatch(saveField(fields));
        }
    }
}

const CustomizedForm = connect(mapStateToProps, mapDispatchToProps)(Form.create({
    name: 'global_state',
    onFieldsChange(props, changedFields) {
        console.log('onFieldsChange', changedFields);
        props.sF(changedFields)
    },
    mapPropsToFields(props) {
        console.log('mapPropsToFields', props)
        return {
            username: Form.createFormField({
                ...props.formState.username,
                value: props.formState.username.value
            }),
        };
    },
})(MyForm));

class App extends Component {
    render() {
        return (
        <div>
            <CustomizedForm/>
        </div>
        );
    }
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
