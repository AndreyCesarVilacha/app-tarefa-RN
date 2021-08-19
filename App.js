import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { AsyncStorageStatic } from 'react-native';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView, Modal, TouchableHighlight, Alert, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
//expo install @expo-google-fonts/lato expo-font expo-app-loading
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';
import AppLoading from 'expo-app-loading';

export default function App() {

  const image = require('./resources/bg.jpg');

  const [modal, setModal] = useState(false);
  const [tarefaAtual, setTarefaAtual] = useState('');
  const [tarefas, setTarefas] = useState([]);

  let [fontsLoaded] = useFonts({
    Lato_400Regular
  });

  useEffect(()=>{
    (async () => {
      try {
        let tarefasAtual = await AsyncStorageStatic.getItem('tarefas');
        if(tarefasAtual == null){
          setTarefas([]);
        } else {
          setTarefas(JSON.parse(tarefaAtual));
        }
      } catch (error){

      }
    })();
  },[]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  function deletarTarefa(id){

    alert('Tarefa com id '+id+" deletada com sucesso!");

    let newTarefas = tarefas.filter((val)=>{
      return val.id != id;
    });

    setTarefas(newTarefas);

    (async () => {
      try{
        await AsyncStorageStatic.setItem('tarefas', JSON.stringify(newTarefas));
      } catch (error){

      }
    })

  }

  function addTarefa(){
    setModal(!modal);
    //alert("Tarefa adicionada com sucesso");
    let id = 0;
    
    if(tarefas.length > 0 ){
      id = tarefas[tarefas.length - 1].id + 1 ;
    }
    
    let tarefa = {id:id, tarefa: tarefaAtual};
    setTarefas([...tarefas,tarefa]);

    (async () => {
      try {
        await AsyncStorageStatic.setItem('tarefas', JSON.stringify([...tarefas,tarefa]));
      } catch (error){
        
      }
    })

  }

  return (
    <ScrollView style={{flex:1}}>

      <StatusBar hidden />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput onChangeText={text => setTarefaAtual(text)} autoFocus={true}></TextInput>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                addTarefa();
              }}
            >
              <Text style={styles.textStyle}>Adicionar Tarefa</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <ImageBackground source={image} style={styles.image}>
        <View style={styles.coverView}>
          <Text style={styles.textHeader}>Lista de Tarefas</Text>
        </View>
      </ImageBackground>

      {
        tarefas.map((val)=>{
          return (
            <View style={styles.tarefaSingle}>
              <View style={{flex:1, width:'100%', padding:10}}>
                <Text>{val.tarefa}</Text>
              </View>
              <View style={{alignItems:'flex-end',flex:1, padding:10}}>
                <TouchableOpacity onPress={()=> deletarTarefa(val.id)}>
                  <AntDesign name="minuscircleo" size={24} color="black"/>
                </TouchableOpacity>
              </View>
            </View>
          )
        })
      }

      <TouchableOpacity style={styles.btnAddTarefa} onPress={()=>setModal(true)}>
        <Text style={{textAlign: 'center', color: 'white'}}>Adicionar Tarefa!</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 70,
    resizeMode: "cover",
  },
  textHeader:{
    textAlign: 'center',
    color: 'white',
    fontSize:20,
    fontWeight:'bold',
    fontFamily: 'Lato_400Regular'
  },
  coverView:{
    width:'100%',
    height:70,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent:"center",
  },
  tarefaSingle:{
    marginTop:30,
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    flexDirection: 'row',
    paddingBottom:10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex:5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  btnAddTarefa:{
    width: 200,
    padding: 8,
    backgroundColor: 'grey',
    marginTop: 20,
  }

});
