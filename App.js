import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, Alert, Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

export default function App() {

  const [loggedin, setLoggedin] = React.useState(false)
  // MODAL STATES
  const [modalLogin, setModalLogin] = useState(false);
  const [modalSignup, setModalSignup] = useState(false);
  const [modalForgetPass, setModalForgetPass] = useState(false);

  // SIGNUP STATES
  const [valueSignup, setValueSignup] = useState({
    name: "",
    email: "",
    password: "",
    securityQuestion: "",
    securityAnswer: ""
  })

  // LOGIN STATES
  const [valueLogin, setValueLogin] = React.useState({
    email: "",
    password: ""
  })


  // MODAL LOGIC
  const handleLoginModal = () => {
    setModalLogin(true)
    setModalSignup(false)
    setModalForgetPass(false)
  }
  const handleSignupModal = () => {
    setModalLogin(false)
    setModalSignup(true)
    setModalForgetPass(false)
  }
  const handleForgetPass = () => {
    setModalLogin(false)
    setModalSignup(false)
    setModalForgetPass(true)
  }


  // LOGIN LOGICS
  const handleInputLogin = (field, value) => {
    setValueLogin({ ...valueLogin, [field]: value });
  }
  const handleSubmitLogin = async (event) => {
    event.preventDefault();
    console.log(valueLogin)
    let res = await fetch("https://enchanting-cape-wasp.cyclic.app/user/login", {
      method: "POST",
      body: JSON.stringify(valueLogin),
      headers: {
        "Content-type": "application/json"
      }
    })
    let data = await res.json();
    if (data.msg === "Wrong Credientials") {
      alert("Invalid Credentials");
      return;
    }
    alert("You are now logged in");
    setLoggedin(true);
    setValueLogin({
      email: "",
      password: ""
    })
  }


  // SIGNUP LOGICS
  const handleInputSignup = (field, value) => {
    setValueSignup({ ...valueSignup, [field]: value });
  }
  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    console.log(valueSignup)
    await fetch("https://enchanting-cape-wasp.cyclic.app/user/register", {
      method: "POST",
      body: JSON.stringify(valueSignup),
      headers: {
        "Content-type": "application/json"
      }
    })
    setValueSignup({
      name: "",
      email: "",
      password: "",
      securityQuestion: "What is the name of your pet?",
      securityAnswer: ""
    })
    alert("You are now signed up")
  }


  // GET QUESTION LOGICS
  const [valueEmail, setValueEmail] = React.useState({
    email: ""
  })
  const [securityQuestion, setSecurityQuestion] = React.useState(false)
  const [valueAns, setValueAns] = React.useState({
    email: "",
    password: "",
    securityAnswer: ""
  })
  const handleChangeEmail = (field, value) => {
    setValueEmail({ ...valueEmail, [field]: value });
  }
  const handleChangeReset = (field, value) => {
    setValueAns({ ...valueAns, [field]: value });
  }
  const handleGetQuestion = async (event) => {
    event.preventDefault();
    console.log(valueEmail);
    let res = await fetch("https://enchanting-cape-wasp.cyclic.app/user/getQuestion", {
      method: "POST",
      body: JSON.stringify(valueEmail),
      headers: {
        "Content-type": "application/json"
      }
    })
    let data = await res.json();
    if (data.msg === "Email not found") {
      alert("Email not found");
      return;
    } else {
      alert("Security question acquired");
    }
    setValueAns({
      email: data.email,
      password: "",
      securityAnswer: ""
    })
    setSecurityQuestion(data.SQ)
    setValueEmail({
      email: ""
    })
  }
  const handlePassword = async (event) => {
    event.preventDefault();
    let res = await fetch("https://enchanting-cape-wasp.cyclic.app/user/forgetPassword", {
      method: "POST",
      body: JSON.stringify(valueAns),
      headers: {
        "Content-type": "application/json"
      }
    })
    let data = await res.json();
    if (data.msg === "Wrong Security Answer") {
      alert("Wrong Security Answer");
      return;
    } else {
      alert("Password changed successfully");
    }
    setValueAns({
      email: "",
      password: "",
      securityAnswer: ""
    })
  }

  const handleLogout = () => {
    setLoggedin(false);
  }
  return loggedin ? (
    <View>
      <TouchableOpacity
        style={styles.buttonTop}
        onPress={handleLogout}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      {/* TOP BAR START */}
      <Text style={{
        fontSize: 30,
        color: "#6481FC",
      }}>Forget Password App</Text>
      <StatusBar style="auto" />
      {/* TOP BAR END */}

      {/* MAIN BUTTON */}
      <View style={styles.buttonMain}>
        <TouchableOpacity
          style={styles.buttonTop}
          onPress={handleLoginModal}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonTop}
          onPress={handleSignupModal}>
          <Text style={styles.text}>Signup</Text>
        </TouchableOpacity>
      </View>
      {/* MAIN BUTTON */}

      {/* LOGIN START*/}
      <View style={styles.modal}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalLogin}
          onRequestClose={() => {
            setModalLogin(false);
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTextTop}>LOGIN</Text>
            <Text style={styles.modalText}>Email</Text>
            <TextInput
              style={styles.modalInput}
              value={valueLogin.email}
              onChangeText={text => handleInputLogin("email", text)}
              placeholder='Enter Email'
            />
            <Text style={styles.modalText}>Password</Text>
            <TextInput
              secureTextEntry
              style={styles.modalInput}
              value={valueLogin.password}
              onChangeText={text => handleInputLogin("password", text)}
              placeholder='Enter Password'
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmitLogin}>
              <Text style={styles.text}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleForgetPass}>
              <Text style={styles.text}>Forget Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalLogin(false)}>
              <Text style={styles.text}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      {/* LOGIN END */}

      {/* FORGOT PASSWORD START */}
      <View style={styles.modal}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalForgetPass}
          onRequestClose={() => {
            setModalForgetPass(false);
          }}
        >
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.modalViewReset}>
              <Text style={styles.modalTextTopReset}>RESET PASSWORD</Text>
              <Text style={styles.modalText}>Email</Text>
              <TextInput
                style={styles.modalInput}
                value={valueEmail.email}
                onChangeText={text => handleChangeEmail("email", text)}
                placeholder='Enter Email'
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleGetQuestion}>
                <Text style={styles.text}>Get Security Question</Text>
              </TouchableOpacity>

              {/* RESET PASSWORD START */}
              {securityQuestion ? (
                <View>
                  <Text style={styles.modalText}>{securityQuestion}</Text>
                  <TextInput
                    secureTextEntry
                    style={styles.modalInput}
                    value={valueAns.securityAnswer}
                    onChangeText={text => handleChangeReset("securityAnswer", text)}
                    placeholder='Answer The Question'
                  />
                  <Text style={styles.modalText}>New Password</Text>
                  <TextInput
                    secureTextEntry
                    style={styles.modalInput}
                    value={valueAns.password}
                    onChangeText={text => handleChangeReset("password", text)}
                    placeholder='Enter New Password'
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handlePassword}>
                    <Text style={styles.text}>Set New Password</Text>
                  </TouchableOpacity>
                </View>
              ) : (null)}

              {/* RESET PASSWORD END */}

              <TouchableOpacity
                style={styles.buttonResetClose}
                onPress={() => setModalForgetPass(false)}>
                <Text style={styles.text}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>
      {/* FORGOT PASSWORD END */}


      {/* SIGNUP START*/}
      <View style={styles.modal}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalSignup}
          onRequestClose={() => {
            setModalSignup(false);
          }}
        >
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.modalViewSignup}>
              <Text style={styles.modalTextTop}>SIGNUP</Text>
              <Text style={styles.modalText}>Username</Text>
              <TextInput
                style={styles.modalInput}
                value={valueSignup.name}
                onChangeText={text => handleInputSignup("name", text)}
                placeholder='Enter Username'
              />
              <Text style={styles.modalText}>Enter Email</Text>
              <TextInput
                style={styles.modalInput}
                value={valueSignup.email}
                onChangeText={text => handleInputSignup("email", text)}
                placeholder='Enter Email'
              />
              <Text style={styles.modalText}>Enter Password</Text>
              <TextInput
                secureTextEntry
                style={styles.modalInput}
                value={valueSignup.password}
                onChangeText={text => handleInputSignup("password", text)}
                placeholder='Enter Password'
              />
              <Text style={styles.modalText}>Security Question</Text>
              <Picker
                selectedValue={valueSignup.securityQuestion}
                style={styles.selectTag}
                value={valueSignup.securityQuestion}
                onValueChange={(itemValue, itemIndex) => handleInputSignup("securityQuestion", itemValue)}
              >
                <Picker.Item style={styles.selectTagText} label="What is the name of your pet?" value="What is the name of your pet?" />
                <Picker.Item style={styles.selectTagText} label="What is your favourite food ?" value="What is your favourite food ?" />
                <Picker.Item style={styles.selectTagText} label="What is your favourite place ?" value="What is your favourite place ?" />
              </Picker>
              <Text style={styles.modalText}>Security Answer</Text>
              <TextInput
                style={styles.modalInput}
                value={valueSignup.securityAnswer}
                onChangeText={text => handleInputSignup("securityAnswer", text)}
                placeholder='Enter Security Answer'
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleSignupSubmit}
              >
                <Text style={styles.text}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalSignup(false)}>
                <Text style={styles.text}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </View>
      {/* SIGNUP END */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMain: {
    marginTop: "25%",
    display: 'flex',
    flexDirection: 'row',
    width: "80%",
    justifyContent: "space-around",
  },
  buttonTop: {
    paddingTop: "5%",
    paddingBottom: "5%",
    paddingLeft: "6%",
    paddingRight: "6%",
    marginTop: "50%",
    borderRadius: 10,
    backgroundColor: "#6481FC",
  },
  button: {
    paddingTop: "5%",
    paddingBottom: "5%",
    textAlign: 'center',
    marginTop: "2%",
    borderRadius: 10,
    backgroundColor: "#6481FC",
  },
  text: {
    textTransform: "uppercase",
    color: "white",
    fontSize: 20,
    textAlign: "center"
  },
  modalView: {
    flex: 1,
    width: "90%",
    paddingTop: "5%",
    paddingLeft: "5%",
    marginLeft: "5%",
    paddingRight: "5%",
    marginTop: "15%",
    // backdropFilter: "blur(10px) saturate(125%)",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "red"
    // backgroundColor: "rgba(255, 255, 255, 0.45)"
  },
  modalText: {
    fontSize: 25,
    marginLeft: 8,
  },
  modalTextTop: {
    textAlign: "center",
    fontSize: 40,
  },
  modalInput: {
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 13,
    paddingBottom: 13,
    backgroundColor: "white",
    fontSize: 20,
    paddingLeft: 20,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalViewSignup: {
    flex: 1,
    width: "90%",
    paddingTop: "5%",
    paddingLeft: "5%",
    marginLeft: "5%",
    paddingRight: "5%",
    marginTop: "20%",
    paddingBottom: "8%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "red"
  },
  modalViewReset: {
    flex: 1,
    width: "90%",
    paddingTop: "5%",
    paddingLeft: "5%",
    marginLeft: "5%",
    paddingRight: "5%",
    marginTop: "20%",
    paddingBottom: "8%",
    borderRadius: 20,
    backgroundColor: "red"
  },
  selectTag: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 8,
  },
  selectTagText: {
    fontSize: 20,
    borderRadius: 10,
  },
  modalTextTopReset: {
    textAlign: "center",
    fontSize: 30,
    marginBottom: "5%"
  },
  buttonResetClose: {
    paddingTop: "5%",
    paddingBottom: "5%",
    textAlign: 'center',
    marginTop: "2%",
    marginBottom: "5%",
    borderRadius: 10,
    backgroundColor: "#6481FC",
  }
});
