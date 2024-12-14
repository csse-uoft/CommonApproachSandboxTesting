import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import {defaultFirstEntryFields} from "../../constants/default_fields";
import {createUser, firstEntryUpdate, updateUser, verifyFirstEntryUser, verifyUser} from "../../api/userApi";
import {Loading} from "../shared";
import {Button, Container, TextField} from "@mui/material";
import {userFirstEntryFields} from "../../constants/userFirstEntryFields";
import {isFieldEmpty} from "../../helpers";
import {REQUIRED_HELPER_TEXT} from "../../constants";
import {AlertDialog} from "../shared/dialogs/Dialogs";
import LoadingButton from "../shared/LoadingButton";
import PasswordHint from "../shared/PasswordHint";
import { useSnackbar } from 'notistack';
import {navigateHelper} from "../../helpers/navigatorHelper";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 12,
  }
}));

export default function UserFirstEntry() {
  const navigator = useNavigate();
  const navigate = navigateHelper(navigator)
  const classes = useStyles();
  const {token} = useParams();
  const {enqueueSnackbar} = useSnackbar();


  const [state, setState] = useState({
    form: {
      ...defaultFirstEntryFields
    },
    errors: {},
    submitDialog: false,
    loading: true,
    email: '',
    uri:'',
    failMessage:'',
    loadingButton: false
  });

  // if (state.loading) {
  //   verifyToken({token})
  // }

  useEffect(()=> {
    verifyFirstEntryUser({token}).then(res => {
      setState(state => ({...state, email: res.email, uri: res.userUri, loading: false}))
    }).catch(e => {
      setState(state => ({...state, loading: false, errors: e.json}))
      navigate(`/login`)
      enqueueSnackbar(e.json?.message || 'Error occurred', {variant: 'error'})
      }
    )
  }, [])


  // async function verifyToken(token) {
  //   try {
  //     const respond = await verifyFirstEntryUser(token);
  //     setState(state => ({...state, verified: true, email: respond.email, id: respond.userId, loading: false}))
  //   } catch (e) {
  //     setState(state => ({...state, verified: false, loading: false, errors: e.json}))
  //   }
  //
  // }

  const handleOnBlur = (field, option) => {

    if (!isFieldEmpty(state.form[field]) && field === "confirmPassword" && !!option.validator(state.form[field], state.form["password"])) {
      setState(state => ({
        ...state,
        errors: {...state.errors, [field]: option.validator(state.form[field], state.form["password"])}
      }))

    } else if (!isFieldEmpty(state.form[field]) && field !== "confirmPassword" && option.validator && !!option.validator(state.form[field])) {

      setState(state => ({...state, errors: {...state.errors, [field]: option.validator(state.form[field])}}))
    } else {
      setState(state => ({...state, errors: {...state.errors, [field]: undefined}}))
    }

  };

  const validate = () => {
    const errors = {};
    for (const [field, option] of Object.entries(userFirstEntryFields)) {
      const isEmpty = isFieldEmpty(state.form[field]);
      if (option.required && isEmpty) {
        errors[field] = REQUIRED_HELPER_TEXT;
      }
      let msg;
      if (!isEmpty && field === "confirmPassword" && (msg = option.validator(state.form[field], state.form["password"]))) {
        errors[field] = msg
      } else if (!isEmpty && field !== "confirmPassword" && option.validator && (msg = option.validator(state.form[field]))) {
        errors[field] = msg;
      }
    }
    if (Object.keys(errors).length !== 0) {
      setState(state => ({...state, errors}));
      return false
    }
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      setState(state => ({...state, submitDialog: true}))
    }
  }

  const handleCancel = () => {
    setState(state => ({...state, submitDialog: false}))
  }

  const handleConfirm = async () => {
    try {
      const securityQuestions = [state.form.securityQuestion1, state.form.securityQuestion2, state.form.securityQuestion3,
        state.form.securityQuestionAnswer1, state.form.securityQuestionAnswer2, state.form.securityQuestionAnswer3]
      setState(state => ({...state, loadingButton: true, }))
      const {success, message} = await firstEntryUpdate({email: state.email, userUri: state.uri, newPassword: state.form.password,
        securityQuestions: securityQuestions})
      if(success){
        setState(state => ({...state, loadingButton: false, submitDialog: false}));
        navigate(`/login/superPassword`);
        enqueueSnackbar(message || 'Success', {variant: 'success'});
      }
    } catch (e) {
      if (e.json) {
        setState(state => ({...state, loadingButton: false, errors: e.json, submitDialog: false}));
        enqueueSnackbar(e.json?.message || 'Failed to register, please try again', {variant: 'error'});
      }
    }

  };


  if (state.loading)
    return <Loading message={`Loading`}/>;



    return (

      <Container className={classes.root}>
        <PasswordHint/>
        <TextField
          sx={{mt: '16px', minWidth: 350}}
          value={state.email}
          label={'Username'}
          disabled
        />
        {Object.entries(userFirstEntryFields).map(([field, option]) => {
          // if (option.validator && !!option.validator(state.form[field]))
          // setState(state => ({...state, errors: {...state.errors, field: option.validator(state.form[field])}}));
          // state.errors[field] = option.validator(state.form[field])
          return (

            <option.component
              key={field}
              label={option.label}
              type={option.type}
              options={option.options}
              value={state.form[field]}
              required={option.required}
              onChange={e => state.form[field] = e.target.value}
              onBlur={() => handleOnBlur(field, option)}
              error={!!state.errors[field]}
              helperText={state.errors[field]}
            />
          )
        })}

        <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
          Submit
        </Button>

        <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={'Are you sure you want to submit?'}
                     buttons={[<Button onClick={handleCancel} key={'cancel'}>{'cancel'}</Button>,
                       // <Button onClick={handleConfirm} key={'confirm'} autoFocus> {'confirm'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading ={state.loadingButton} key={'confirm'}
                                      onClick={handleConfirm} children='confirm' autoFocus/>]}
                     open={state.submitDialog}/>
        {/*<AlertDialog dialogContentText={"You are successfully registered"}*/}
        {/*             dialogTitle={'Success'}*/}
        {/*             buttons={[<Button onClick={() => {navigate('/login')}} key={'success'}> {'ok'}</Button>]}*/}
        {/*             open={state.successDialog}/>*/}
        {/*<AlertDialog dialogContentText={state.errors.message || "Fail to update"}*/}
        {/*             dialogTitle={'Fail'}*/}
        {/*             buttons={[<Button onClick={() => {navigate('/login')}} key={'fail'}>{'ok'}</Button>]}*/}
        {/*             open={state.failDialog}/>*/}
      </Container>

    )
  // } else {
  //   // return (<AlertDialog dialogContentText={state.errors.message || "The token is invalid"}
  //   //                      dialogTitle={'Invalid token'}
  //   //                      buttons={[<Button onClick={() => {navigate('/login')}} key={'invalidToken'}>{'ok'}</Button>]}
  //   //                      open={!state.verified}
  //   // />)
  //
  //
  // }


}