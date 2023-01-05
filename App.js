/* eslint-disable react-native/no-inline-styles */
/* eslint-disable radix */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
  TextInput,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import RNMomosdk from 'react-native-momosdk';
import themes from './src/themes';

const RNMomosdkModule = NativeModules.RNMomosdk;
const EventEmitter = new NativeEventEmitter(RNMomosdkModule);

const App = () => {
  const [paymentResponse, setPaymentResponse] = useState('');
  const [dataPayment, setDataPayment] = useState({
    merchantname: 'HoangNguyen',
    merchantcode: 'MOMOCFX120220328',
    merchantNameLabel: 'Nhà cung cấp',
    billdescription: 'Fast and Furious 8',
    orderId: 'ID123456',
    amount: '50000',
    appScheme: 'momocfx120220328',
    enviroment: '0',
  });

  useEffect(() => {
    EventEmitter.addListener(
      'RCTMoMoNoficationCenterRequestTokenReceived',
      response => {
        setPaymentResponse(JSON.stringify(response));
      },
    );
    EventEmitter.addListener(
      'RCTMoMoNoficationCenterRequestTokenState',
      response => {
        console.log('<MoMoPay>Listen.RequestTokenState:: ' + response.status);
        setPaymentResponse(JSON.stringify(response));
        // status = 1: Parameters valid & ready to open MoMo app.
        // status = 2: canOpenURL failed for URL MoMo app
        // status = 3: Parameters invalid
      },
    );
  }, []);

  const momoHandleResponse = async response => {
    setPaymentResponse(JSON.stringify(response));
  };

  const onPress = async () => {
    let jsonData = {};
    jsonData.enviroment = dataPayment.enviroment; //SANBOX OR PRODUCTION
    jsonData.action = 'gettoken'; //DO NOT EDIT
    jsonData.merchantname = dataPayment.merchantname; //edit your merchantname here
    jsonData.merchantcode = dataPayment.merchantcode; //edit your merchantcode here
    jsonData.merchantnamelabel = dataPayment.merchantNameLabel;
    jsonData.description = dataPayment.billdescription;
    jsonData.amount = parseInt(dataPayment.amount) || 50000; //order total amount
    jsonData.orderId = dataPayment.orderId;
    jsonData.orderLabel = 'Ma don hang';
    jsonData.appScheme = dataPayment.appScheme; // iOS App Only , match with Schemes Indentify from your  Info.plist > key URL types > URL Schemes

    if (Platform.OS === 'android') {
      let data = await RNMomosdk.requestPayment(jsonData);
      console.log('response', data);
      momoHandleResponse(data);
    } else {
      RNMomosdk.requestPayment(jsonData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{width: '100%'}}>
        <View style={styles.inputView}>
          <TextInput
            value={dataPayment.merchantname}
            onChangeText={value =>
              setDataPayment({
                ...dataPayment,
                merchantname: value,
              })
            }
            placeholder="Nhập merchantname"
            placeholderTextColor={'#808080'}
            style={styles.inputStyle}
          />
          <TextInput
            value={dataPayment.merchantcode}
            onChangeText={value =>
              setDataPayment({
                ...dataPayment,
                merchantcode: value,
              })
            }
            placeholder="Nhập merchantcode"
            placeholderTextColor={'#808080'}
            style={styles.inputStyle}
          />
          <TextInput
            value={dataPayment.merchantNameLabel}
            onChangeText={value =>
              setDataPayment({
                ...dataPayment,
                merchantNameLabel: value,
              })
            }
            placeholder="Nhập merchantNameLabel"
            placeholderTextColor={'#808080'}
            style={styles.inputStyle}
          />
          <TextInput
            value={dataPayment.billdescription}
            onChangeText={value =>
              setDataPayment({
                ...dataPayment,
                billdescription: value,
              })
            }
            placeholder="Nhập billdescription"
            placeholderTextColor={'#808080'}
            style={styles.inputStyle}
          />
          <TextInput
            value={dataPayment.appScheme}
            onChangeText={value =>
              setDataPayment({
                ...dataPayment,
                appScheme: value,
              })
            }
            placeholder="Nhập appScheme"
            placeholderTextColor={'#808080'}
            style={styles.inputStyle}
          />
          <TextInput
            value={dataPayment.orderId}
            onChangeText={value =>
              setDataPayment({
                ...dataPayment,
                orderId: value,
              })
            }
            placeholder="Nhập mã giao dịch"
            placeholderTextColor={'#808080'}
            style={styles.inputStyle}
          />
          <TextInput
            value={dataPayment.amount}
            onChangeText={value =>
              setDataPayment({
                ...dataPayment,
                amount: value,
              })
            }
            placeholder="Nhập số tiền giao dịch"
            placeholderTextColor={'#808080'}
            style={styles.inputStyle}
            keyboardType="number-pad"
          />
        </View>
        <TouchableOpacity style={styles.momoBtn} onPress={onPress}>
          <Text style={styles.momoText}>Thanh toán</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.textResponse}>Response:</Text>
          <TouchableOpacity
            style={styles.btnCopy}
            onPress={() => Clipboard.setString(paymentResponse)}>
            <Text style={styles.textResponse}>Copy</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.resultResponse}>{paymentResponse || ''}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  momoBtn: {
    backgroundColor: themes.Color.momo,
    padding: themes.Spacing.medium,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  momoText: {
    color: themes.Color.white,
    fontSize: themes.FontSize.medium,
    fontWeight: '500',
  },
  inputStyle: {
    width: '90%',
    height: 40,
    borderWidth: 0.5,
    marginVertical: 5,
    borderRadius: 5,
    paddingLeft: 10,
  },
  inputView: {
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  textResponse: {
    fontSize: 16,
    marginVertical: 10,
    color: '#000000',
    marginLeft: 16,
  },
  resultResponse: {
    fontSize: 14,
    color: '#000000',
    marginHorizontal: 16,
  },
  btnCopy: {
    borderWidth: 0.5,
    marginLeft: 10,
    marginTop: 10,
    width: 80,
    borderRadius: 5,
  },
});

export default App;
