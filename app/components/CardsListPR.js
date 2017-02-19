/**
 * Created by dionid on 17.02.17.
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableHighlight,
    Dimensions,
    View,
    Animated,
    Easing,
    ScrollView,
    Image
} from 'react-native';
import HistoryComponent from "./HistoryComponent";

const screenWidth = Dimensions.get('window').width,
    screenHeight = Dimensions.get('window').height - 160;

export const cardWrHeight = Math.floor((screenWidth-60)*0.62);

export default class CardsListPR extends Component {

    static defaultProps = {
        cardsNumber: 6,
        initialOffset: cardWrHeight*5,
        cards: [
            {
                id: 0
            },{
                id: 1
            },{
                id: 2
            },{
                id: 3
            },{
                id: 4
            },{
                id: 5
            }
        ]
    };

    state = {
        height: [0,10,20,30,40,cardWrHeight-20],
        opacity: [0,0.3,0.3,0.7,.9,1],
        rotateX: [0,0,0,-5,-10,-15],
        position: [0,0,5,20,50,95],
        translateY: [0,0,0,0,0,0]
    };

    getStyle = ()=>{
        return [
            styles.cardsContainer,
            {}
        ]
    };

    getCardWrStyle = (index)=>{
        return [
            styles.cardWr,
            {
                height: this.state.height[index],
                opacity: this.state.opacity[index]
            }
        ]
    };

    getCardStyle = (index)=>{
        return [
            styles.card,
            {
                transform: [
                    { perspective: 1000 },
                    {
                        translateY: this.state.translateY[index]
                    },
                    {
                        rotateX: this.state.rotateX[index] + 'deg'
                    }
                ]
            }
        ]
    };

    currentOffset = 0;

    lastYPos = 0;
    initialHeight = [0,10,20,30,40,cardWrHeight-20];
    MAXIMAL_ROTATEX_VALUE = -60;
    sensitive = 40;

    _onStartShouldSetResponder = (e)=> {
        this.dragging = true;
        //Setup initial drag coordinates
        this.drag = {
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY
        };

        this.lastYPos = e.nativeEvent.pageY;

        return true;
    };

    _onMoveShouldSetResponder = (e)=> {
        return true;
    };

    getElPosition = (index)=>{
        return this.state.height.slice(1,index).reduce((sum,cur)=>{
            return sum + cur
        },this.state.height[0])
    };

    handleScroll = (e)=>{
        const curYPos = e.nativeEvent.pageY,
            step = (this.lastYPos - curYPos)*-1*(this.sensitive/400),
            directionUp = step < 0;

        const resObj = {
            height: [],
            rotateX: [],
            opacity: [],
            translateY: []
        };

        // console.log(step)

        this.state.height.forEach((num,i)=>{
            const pos = this.getElPosition(i);

            let heightValue = num,
                rotateXValue = 0;


            // console.log(screenHeight/1.5);

            if(pos < screenHeight/1.7 && pos > 15){
                heightValue += step*15;
            } else if (pos > screenHeight/1.7){
                // heightValue -= step*(15*i);
            } else {
                heightValue += step;
            }

            if((pos*0.5) < (screenHeight/1.7)){
                rotateXValue = (pos*0.5)/(screenHeight/1.7)*this.MAXIMAL_ROTATEX_VALUE - (i < 2 ? 15*i : 15);
            } else if ((pos*0.5) > (screenHeight/1.7)){
                rotateXValue = this.MAXIMAL_ROTATEX_VALUE - 15
            }

            let translateY = 0;

            if(pos > screenHeight/1.7){
                translateY = -20;
            }

            resObj.translateY.push(translateY);

            resObj.height.push(heightValue >= cardWrHeight-20 ? cardWrHeight-20 : this.initialHeight[i] > heightValue ? this.initialHeight[i] : heightValue);

            resObj.rotateX.push(rotateXValue);

            resObj.opacity.push(pos/(screenHeight/1.7)*6.5);

        });

        // if(resObj.height.reduce((sum,cur)=>{return sum+cur}) > 870) return;


        this.setState({
            ...resObj
        });

        // console.log(resObj.height.reduce((sum,cur)=> sum+cur ));

        this.lastYPos = curYPos;

    };

    handleRelease = (e)=>{
        this.dragging = false;
    };

    render() {
        return (
            <View style={this.getStyle()}>
                <Animated.View
                    onResponderMove={this.handleScroll}
                    onResponderRelease={this.handleRelease}
                    onStartShouldSetResponder={this._onStartShouldSetResponder}
                    onMoveShouldSetResponder={this._onMoveShouldSetResponder}
                >
                    {
                        this.props.cards.map((card,i)=>{
                            return (
                                <View key={card.id} style={this.getCardWrStyle(i)}>
                                    <Animated.Image source={require('../bg.png')} style={this.getCardStyle(i)}>

                                    </Animated.Image>
                                </View>
                            )
                        })
                    }
                    <HistoryComponent/>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardsContainer: {
        paddingTop: 20
    },
    cardWr:{
        height: cardWrHeight,
        alignSelf: 'stretch',
    },
    // text:{
    //     color: '#fff',
        // textAlign: 'center'
    // },
    card: {
        height: cardWrHeight,
        position: 'absolute',
        width: 320,
        marginHorizontal: 30,
        borderRadius: 10,
        // borderColor: 'white',
        // borderWidth: 1,

    }
});