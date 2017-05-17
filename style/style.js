import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    flex: 1,
    padding: 8,
  },
  container:{
    flex: 1,
    padding: 10
  },
  containerDrink:{
    flex:1,
    alignItems:'stretch',
    alignSelf:'stretch',
  },
  containerSelectedDrink:{
    flex: 0.45,
    alignItems: 'flex-start',
    alignSelf:'stretch',
  },
  containerOrder:{
    flex: 1,
    padding: 10,
    justifyContent:'space-between'
  },
  containerRowOrder:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:8
  },
  textOrder:{
    fontSize: 24,
    fontWeight:'bold'
  },
  margin:{
    marginTop: 8,
  },
  containerOrders: {
    flex: 1,
    padding: 10
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    flex: 1,
    height: 7,
    backgroundColor: '#FFFFFF',
  }
});
