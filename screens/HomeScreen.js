import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View, Platform, KeyboardAvoidingView} from 'react-native';
import {Text, TextInput, Snackbar} from 'react-native-paper';
import {useTheme} from '@react-navigation/native';
import {FieldArray, Formik, getIn} from 'formik';
import * as yup from 'yup';
import {globalStyles} from '../styles/global';
import * as Animatable from 'react-native-animatable';
import {generate} from 'shortid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-community/picker';
import {getDateAsString, showToast} from '../commons/CommonUtils';
import {addWord} from '../api/endpoints';
import Loading from '../components/Loading';
import {wordRemainderBaseUrl} from '../api/request';
import Toast from "react-native-simple-toast";


const reviewSchema = yup.object({
  word: yup.string()
      .required()
      .min(1),

  partsOfSpeech: yup.string()
      .required(),

  meaning: yup.string()
      .required()
      .min(3),

  sentence: yup.string().required(),

  synonyms: yup.array().of(
      yup.object().shape({
        word: yup.string().required(),
      }),
  ),
});

const HomeScreen = (props) => {

  const [loading, setLoading] = useState(false);
  const [snackVisible, setsSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const {colors} = useTheme();
  const theme = useTheme();

  const showSnack = (message) => {
    showToast(message);
  };

  const addReview = (values, actions) => {

    let word = buildWord(values);

    setLoading(true);

    addWord(word).then(res => {
      if (res.data.success) {
        console.log("Resp: ", res.data.data);
        showSnack(` ${res.data.data.name} Added Successfully`);
        actions.resetForm({
          word: '', partsOfSpeech: 'Noun', meaning:'', sentence: '', synonyms: [{id: '1', word: ''}]});
        setLoading(false);
      }
      else {
        console.log("ResErr: ", res.data.errorMessage);
        showSnack(res.data.errorMessage);
        setLoading(false);
      }
    }).catch(err => {
      console.log("Err: ", err.message);
      showSnack(err.message);
      setLoading(false);
    });

  };


  const buildWord = (values) => {
    let word = {...values};
    let synonym = "";

    if(word.synonyms){
      let size = word.synonyms.length;
      for(let i=0;i<size;i++){
        if(i !== (size-1))
          synonym += word.synonyms[i].word + ",";
        else
          synonym += word.synonyms[i].word;
      }
    }
    word.synonyms = synonym;
    word.date = getDateAsString(new Date());
    word.name = word.word;
    delete word.word;

    return word;
  };

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  if(loading)
    return <Loading/>;

  return (

      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={keyboardVerticalOffset}
        style={{padding: 20, flex: 1}}>
        <ScrollView>
        <Formik
            initialValues={{
              word: '', partsOfSpeech: 'Noun', meaning:'', sentence: '', synonyms: [{id: '1', word: ''}],
            }}
            validationSchema={reviewSchema}
            onSubmit={(values, actions) => {
              addReview(values, actions);
            }}>
          {props => (
              <View>
                <TextInput
                    label={'Word'}
                    mode={'outlined'}
                    placeholder='Word'
                    placeholderTextColor={'red'}
                    onChangeText={props.handleChange('word')}
                    onBlur={props.handleBlur('word')}
                    value={props.values.word}
                />
                {
                  props.touched.word &&
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={globalStyles.errorText}>{props.errors.word}</Text>
                  </Animatable.View>
                }

                <View style={{flexDirection:'row', justifyContent: "center", alignItems: 'center'}}>

                  <Text style={{textAlignVertical:'center', fontWeight:'700', flex:2}}>
                    Parts Of Speech
                  </Text>

                  <View style={{marginVertical: 10,
                    marginHorizontal:5,
                    marginRight:20, borderColor: colors.text,
                    borderWidth:1,
                    borderRadius: 10, alignSelf: 'center',flex: 3}}>

                    <Picker
                        selectedValue={props.values.partsOfSpeech}
                        onValueChange={props.handleChange('partsOfSpeech')}
                    >
                      <Picker.Item color={colors.text} label="Noun" value="Noun"/>
                      <Picker.Item label="Pronoun" value="pronoun"/>
                      <Picker.Item label="Verb" value="verb"/>
                      <Picker.Item label="AdVerb" value="verb"/>
                      <Picker.Item label="Adjective" value="Adjective"/>
                      <Picker.Item label="Preposition" value="Preposition"/>
                      <Picker.Item label="Conjunction" value="Conjunction"/>
                      <Picker.Item label="Interjection" value="Interjection"/>
                    </Picker>
                  </View>

                </View>
                {
                  props.touched.partsOfSpeech &&
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={globalStyles.errorText}>{props.errors.partsOfSpeech}</Text>
                  </Animatable.View>
                }

                <TextInput
                    style={{marginVertical:5}}
                    label={'Meaning'}
                    mode={'outlined'}
                    placeholder='Meaning'
                    onChangeText={props.handleChange('meaning')}
                    onBlur={props.handleBlur('meaning')}
                    value={props.values.meaning}
                />
                {
                  props.touched.meaning &&
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={globalStyles.errorText}>{props.errors.meaning}</Text>
                  </Animatable.View>
                }

                <TextInput
                    label={'Usage'}
                    mode={'outlined'}
                    multiline={true}
                    style={{marginVertical:5}}
                    numberOfLines={3}
                    placeholder='Word Usage in a sentence'
                    onChangeText={props.handleChange('sentence')}
                    onBlur={props.handleBlur('sentence')}
                    value={props.values.sentence}
                />
                {
                  props.touched.sentence &&
                  <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={globalStyles.errorText}>{props.errors.sentence}</Text>
                  </Animatable.View>
                }

                <FieldArray name="synonyms">
                  {({push, remove}) => (
                      <View>
                        {props.values.synonyms.map((p, index) => {
                          let name = `synonyms[${index}].word`;
                          let errors = getIn(props.errors, name);
                          let touched = getIn(props.touched, name);
                          return (
                              <View key={p.id}>
                                <View style={{flexDirection: 'row'}}>
                                  <TextInput
                                      label={'Synonym'}
                                      mode={'outlined'}
                                      style={{flex: 1}}
                                      name={`synonyms[${index}].word`}
                                      placeholder='Synonym'
                                      onChangeText={props.handleChange(`synonyms[${index}].word`)}
                                      onBlur={props.handleBlur(`synonyms[${index}].word`)}
                                      value={props.values.synonyms[index].word}
                                  />
                                  <TouchableOpacity onPress={() => remove(index)}>
                                    <Text style={{flex: 1, textAlignVertical: 'center', marginLeft: 5, marginTop: 10}}>
                                      <MaterialIcons
                                          name='close'
                                          size={30}/>
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                {
                                  touched &&
                                  <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={globalStyles.errorText}>
                                      {errors}
                                    </Text>
                                  </Animatable.View>
                                }
                              </View>
                          );
                        })}

                        <TouchableOpacity style={{alignSelf:'flex-end', marginTop:8,
                          height:40,
                          backgroundColor:'purple'}}
                                          onPress={() =>
                                              push({id: generate(), word: ''})}>
                          <Text style={{color: 'white',
                            fontWeight:'400', fontSize:16, textAlignVertical:'center'}}>
                            &nbsp;
                            <MaterialIcons name={"add"} size={24}/>
                            &nbsp;&nbsp; Add Synonym&nbsp;&nbsp;
                          </Text>
                        </TouchableOpacity>
                      </View>
                  )}
                </FieldArray>

                <TouchableOpacity onPress={addReview}>
                  <Text>Post req</Text>
                </TouchableOpacity>

                <View style={styles.button}>
                  <TouchableOpacity
                      style={styles.signIn}
                      onPress={props.handleSubmit}>

                    <Text style={[styles.textSign, {color: colors.text}]}>
                      <MaterialIcons name={'add'} size={24}/>
                      Save Word
                    </Text>
                  </TouchableOpacity>

                </View>

                <Text style={{height: 100}}/>

              </View>
          )}
        </Formik>
      </ScrollView>
      </KeyboardAvoidingView>
  );
};


export default HomeScreen;

const styles = StyleSheet.create({
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18
  },
  signIn:{
    marginVertical:10,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#08d4c4'
  }
});
