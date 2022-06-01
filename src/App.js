import React, { useEffect, useState } from 'react'
import Garden from './components/Garden.js'
import './style.css';

function App() {

  const [garden, setGarden] = useState([]);
  const [inputHidden, setInputHidden] = useState(false);
  const [buttonHidden, setButtonHidden] = useState(true);
  const [firstMowerFinished, setFirstMowerFinished] = useState(false);
  const [secondMowerFinished, setSecondMowerFinished] = useState(false);
  let timer;



  //UseState and useEffect of the static garden data 
  const [staticGardenData, setStaticGardenData] = useState({
    'gardenXSize' : '',
    'gardenYSize' : '',
    'firstMowerPosition' : '',
    'firstMowerInstruction' : '',
    'secondMowerPosition' : '',
    'secondMowerInstruction' : ''
  });

  useEffect(()=>{
    //Skip when component first rendered
    if(staticGardenData.gardenXSize === ''){
      console.log('garden data update skipped')
    }else{
      setFirstMowerVariableData({
        'xPosition' : staticGardenData.firstMowerPosition.split('')[0],
        'yPosition' : staticGardenData.firstMowerPosition.split('')[1],
        'orientation' : staticGardenData.firstMowerPosition.split(' ')[1]
      });
      setSecondMowerVariableData({
        'xPosition' : staticGardenData.secondMowerPosition.split('')[0],
        'yPosition' : staticGardenData.secondMowerPosition.split('')[1],
        'orientation' : staticGardenData.secondMowerPosition.split(' ')[1]
      })
    }
  }, [staticGardenData])



  //UseState and useEffect of the instruction to treat
  const [instructionToTreat, setInstructionToTreat] = useState({
    'instruction' : '',
    'targetMower' : ''
  });

  useEffect(()=>{
    //Skip when component first rendered
    if(instructionToTreat.instruction === ''){
      console.log('instruction update skipped')
    }else{
      treatSingleInstruction(instructionToTreat.instruction, instructionToTreat.targetMower)
    }
  }, [instructionToTreat])



  //UseState and useEffect of the compteur for mowers intruction
  const [compteur, setCompteur] = useState(-1);

  useEffect(()=>{
    //Skip when component first rendered
    if(compteur === -1){
      console.log('compteur update skipped')
    }else{
      const firstMowerInstructionLength = staticGardenData.firstMowerInstruction.split('').length
      const secondMowerInstructionLength = staticGardenData.secondMowerInstruction.split('').length
      //set an interval to rerender the garden every O.5 second
      timer = !timer && setInterval(()=>{
        if(compteur < firstMowerInstructionLength){
          setInstructionToTreat({
            'instruction' : staticGardenData.firstMowerInstruction.split('')[compteur],
            'targetMower' : 'first mower'
          })
        }else{
          setInstructionToTreat({
            'instruction' : staticGardenData.secondMowerInstruction.split('')[compteur - firstMowerInstructionLength],
            'targetMower' : 'second mower'
          })
        }
        //if the intructions for the first mower have been fully treated : show its position and orientation
        if (compteur === (firstMowerInstructionLength)){
          setFirstMowerFinished(true)
        }
        setCompteur(compteur => compteur + 1)
      }, (500))
      //if the list of instructions have been fully treated : stop the interval and show the second mower's position and orientation
      if (compteur === (firstMowerInstructionLength + secondMowerInstructionLength)){
        setSecondMowerFinished(true)
        clearInterval(timer)
      }
      return () => clearInterval(timer)
    }
  }, [compteur])



  //UseState and useEffect of the first variable mower data
  const [firstMowerVariableData, setFirstMowerVariableData] = useState({
    'xPosition' : '',
    'yPosition' : '',
    'orientation' : ''
  });

  useEffect(()=>{
    //Skip when component first rendered
    if(firstMowerVariableData.orientation === ''){
      console.log('first mower update skipped')
    }else{
      console.log('first mower state : ' + firstMowerVariableData.xPosition + firstMowerVariableData.yPosition + firstMowerVariableData.orientation)
      if(firstMowerFinished){
        console.log('The first mower finished at position [' + firstMowerVariableData.xPosition + ',' + firstMowerVariableData.yPosition + '] with ' + firstMowerVariableData.orientation + ' orientation')
      }
    }
  }, [firstMowerVariableData, firstMowerFinished])



  //UseState and useEffect of the second variable mower data
  const [secondMowerVariableData, setSecondMowerVariableData] = useState({
    'xPosition' : '',
    'yPosition' : '',
    'orientation' : ''
  });

  useEffect(()=>{
    //Skip when component first rendered
    if(secondMowerVariableData.orientation === ''){
      console.log('second mower update skipped')
    }else{
      console.log('second mower state : ' + secondMowerVariableData.xPosition + secondMowerVariableData.yPosition + secondMowerVariableData.orientation)
      if(secondMowerFinished){
        console.log('The second mower finished at position [' + secondMowerVariableData.xPosition + ',' + secondMowerVariableData.yPosition + '] with ' + secondMowerVariableData.orientation + ' orientation')
      }
    }
  }, [secondMowerVariableData, secondMowerFinished])




  const readFile = (e) => {

    e.preventDefault();
    const reader = new FileReader();

    reader.onload = (e) => {
      //getting the content of the txt file
      const text = e.target.result;
      //Parsing its content to get specific information
      parseTxtFile(text)
    };

    reader.onloadend = () =>{
      //Hide the input button and show the start button
      setInputHidden(true);
      setButtonHidden(false);
    }

    const parseTxtFile = (text) => {

      const splittedTextByLines = text.split('\n');
      const gardenSize = splittedTextByLines[0];

      //instantiate the initial empty garden
      const initialGarden = []

      for(let i=0; i<parseInt(gardenSize.split('')[0]); i++){
        initialGarden.push([]);
        for(let k=0; k<parseInt(gardenSize.split('')[1]); k++){
          initialGarden[i].push('empty');
        }
      }

      //set the initial position and orientation of the mowers
      initialGarden[parseInt(splittedTextByLines[1].split('')[0])-1][parseInt(gardenSize.split('')[1]) - parseInt(splittedTextByLines[1].split('')[1])] = 'mower' + splittedTextByLines[1].split(' ')[1];
      initialGarden[parseInt(splittedTextByLines[3].split('')[0])-1][parseInt(gardenSize.split('')[1]) - parseInt(splittedTextByLines[3].split('')[1])] = 'mower' + splittedTextByLines[3].split(' ')[1];

      //render the initial filled garden
      setGarden(initialGarden)

      //setting the initial data for future treatment
      setStaticGardenData({
        'gardenXSize' : gardenSize.split('')[0],
        'gardenYSize' : gardenSize.split('')[1],
        'firstMowerPosition' : splittedTextByLines[1],
        'firstMowerInstruction' : splittedTextByLines[2],
        'secondMowerPosition' : splittedTextByLines[3],
        'secondMowerInstruction' : splittedTextByLines[4]
      })

      setFirstMowerVariableData({
        'xPosition' : splittedTextByLines[1].split('')[0],
        'yPosition' : splittedTextByLines[1].split('')[1],
        'orientation' : splittedTextByLines[1].split(' ')[1]
      })

      setSecondMowerVariableData({
        'xPosition' : splittedTextByLines[3].split('')[0],
        'yPosition' : splittedTextByLines[3].split('')[1],
        'orientation' : splittedTextByLines[3].split(' ')[1]
      })
    }

    reader.readAsText(e.target.files[0]);
  };

  const startCuttingGrass = () => {
    //hide start button and start the compteur
    setButtonHidden(true)
    setCompteur(0)
  }

  const treatSingleInstruction = (instruction, mower) => {

    //initiate a new empty garden
    let newGarden = [];

    for(let i=0; i<parseInt(staticGardenData.gardenXSize); i++){
      newGarden.push([]);
      for(let k=0; k<parseInt(staticGardenData.gardenYSize); k++){
        newGarden[i].push('empty');
      }
    }

    //treatment for the first mower
    if(mower === 'first mower'){
      switch (instruction) {
        case 'F':
          
          switch (firstMowerVariableData.orientation) {
            case 'N':
              setFirstMowerVariableData({
                'xPosition' : firstMowerVariableData.xPosition,
                'yPosition' : '' + (parseInt(firstMowerVariableData.yPosition) + 1),
                'orientation' : firstMowerVariableData.orientation
              })
              break;
  
            case 'E':
              setFirstMowerVariableData({
                'xPosition' : '' + (parseInt(firstMowerVariableData.xPosition) + 1),
                'yPosition' : firstMowerVariableData.yPosition,
                'orientation' : firstMowerVariableData.orientation
              })
              break;
  
            case 'S':
              setFirstMowerVariableData({
                'xPosition' : firstMowerVariableData.xPosition,
                'yPosition' : '' + (parseInt(firstMowerVariableData.yPosition) - 1),
                'orientation' : firstMowerVariableData.orientation
              })
              break;
  
            case 'W':
              setFirstMowerVariableData({
                'xPosition' : '' + (parseInt(firstMowerVariableData.xPosition) - 1),
                'yPosition' : firstMowerVariableData.yPosition,
                'orientation' : firstMowerVariableData.orientation
              })
              break;
  
            default:
              break;
          }
  
          break;
        
        case 'R':
  
          switch (firstMowerVariableData.orientation) {
            case 'N':
              setFirstMowerVariableData({
                'xPosition' : firstMowerVariableData.xPosition,
                'yPosition' : firstMowerVariableData.yPosition,
                'orientation' : 'E'
              })
              break;
  
            case 'E':
              setFirstMowerVariableData({
                'xPosition' : firstMowerVariableData.xPosition,
                'yPosition' : firstMowerVariableData.yPosition,
                'orientation' : 'S'
              })
              break;
  
            case 'S':
              setFirstMowerVariableData({
                'xPosition' : firstMowerVariableData.xPosition,
                'yPosition' : firstMowerVariableData.yPosition,
                'orientation' : 'W'
              })
              break;
  
            case 'W':
              setFirstMowerVariableData({
                'xPosition' : firstMowerVariableData.xPosition,
                'yPosition' : firstMowerVariableData.yPosition,
                'orientation' : 'N'
              })
              break;
  
            default:
              break;
          }
  
          break;
  
        case 'L':
  
          switch (firstMowerVariableData.orientation) {
            case 'N':
              setFirstMowerVariableData({
                'xPosition' : firstMowerVariableData.xPosition,
                'yPosition' : firstMowerVariableData.yPosition,
                'orientation' : 'W'
              })
              break;
  
            case 'E':
              setFirstMowerVariableData({
                'xPosition' : firstMowerVariableData.xPosition,
                'yPosition' : firstMowerVariableData.yPosition,
                'orientation' : 'N'
              })
              break;
  
            case 'S':
              setFirstMowerVariableData({
                'xPosition' : firstMowerVariableData.xPosition,
                'yPosition' : firstMowerVariableData.yPosition,
                'orientation' : 'E'
              })
              break;
  
            case 'W':
              setFirstMowerVariableData({
                'xPosition' : firstMowerVariableData.xPosition,
                'yPosition' : firstMowerVariableData.yPosition,
                'orientation' : 'S'
              })
              break;
  
            default:
              break;
          }
  
          break;
  
        default:
          break;
      }
    }
    //treatment for the second mower
    else if(mower === 'second mower'){
      switch (instruction) {
        case 'F':
          
          switch (secondMowerVariableData.orientation) {
            case 'N':
              setSecondMowerVariableData({
                'xPosition' : secondMowerVariableData.xPosition,
                'yPosition' : '' + (parseInt(secondMowerVariableData.yPosition) + 1),
                'orientation' : secondMowerVariableData.orientation
              })
              break;
  
            case 'E':
              setSecondMowerVariableData({
                'xPosition' : '' + (parseInt(secondMowerVariableData.xPosition) + 1),
                'yPosition' : secondMowerVariableData.yPosition,
                'orientation' : secondMowerVariableData.orientation
              })
              break;
  
            case 'S':
              setSecondMowerVariableData({
                'xPosition' : secondMowerVariableData.xPosition,
                'yPosition' : '' + (parseInt(secondMowerVariableData.yPosition) - 1),
                'orientation' : secondMowerVariableData.orientation
              })
              break;
  
            case 'W':
              setSecondMowerVariableData({
                'xPosition' : '' + (parseInt(secondMowerVariableData.xPosition) - 1),
                'yPosition' : secondMowerVariableData.yPosition,
                'orientation' : secondMowerVariableData.orientation
              })
              break;
  
            default:
              break;
          }
  
          break;
        
        case 'R':
  
          switch (secondMowerVariableData.orientation) {
            case 'N':
              setSecondMowerVariableData({
                'xPosition' : secondMowerVariableData.xPosition,
                'yPosition' : secondMowerVariableData.yPosition,
                'orientation' : 'E'
              })
              break;
  
            case 'E':
              setSecondMowerVariableData({
                'xPosition' : secondMowerVariableData.xPosition,
                'yPosition' : secondMowerVariableData.yPosition,
                'orientation' : 'S'
              })
              break;
  
            case 'S':
              setSecondMowerVariableData({
                'xPosition' : secondMowerVariableData.xPosition,
                'yPosition' : secondMowerVariableData.yPosition,
                'orientation' : 'W'
              })
              break;
  
            case 'W':
              setSecondMowerVariableData({
                'xPosition' : secondMowerVariableData.xPosition,
                'yPosition' : secondMowerVariableData.yPosition,
                'orientation' : 'N'
              })
              break;
  
            default:
              break;
          }
  
          break;
  
        case 'L':
  
          switch (secondMowerVariableData.orientation) {
            case 'N':
              setSecondMowerVariableData({
                'xPosition' : secondMowerVariableData.xPosition,
                'yPosition' : secondMowerVariableData.yPosition,
                'orientation' : 'W'
              })
              break;
  
            case 'E':
              setSecondMowerVariableData({
                'xPosition' : secondMowerVariableData.xPosition,
                'yPosition' : secondMowerVariableData.yPosition,
                'orientation' : 'N'
              })
              break;
  
            case 'S':
              setSecondMowerVariableData({
                'xPosition' : secondMowerVariableData.xPosition,
                'yPosition' : secondMowerVariableData.yPosition,
                'orientation' : 'E'
              })
              break;
  
            case 'W':
              setSecondMowerVariableData({
                'xPosition' : secondMowerVariableData.xPosition,
                'yPosition' : secondMowerVariableData.yPosition,
                'orientation' : 'S'
              })
              break;
  
            default:
              break;
          }
  
          break;
  
        default:
          break;
      }
    }

    //setting the two mowers on their new position/orientation
    newGarden[parseInt(firstMowerVariableData.xPosition)-1][parseInt(staticGardenData.gardenYSize) - parseInt(firstMowerVariableData.yPosition)] = 'mower' + firstMowerVariableData.orientation;
    newGarden[parseInt(secondMowerVariableData.xPosition)-1][parseInt(staticGardenData.gardenYSize) - parseInt(secondMowerVariableData.yPosition)] = 'mower' + secondMowerVariableData.orientation;
    setGarden(newGarden)
  }

  return(
    <div className='app'>
      {!inputHidden ?
        <input type="file" onChange={readFile}/> : null
      }
      <Garden garden={garden}/>
      {!buttonHidden ?
        <button onClick={startCuttingGrass}>
          START
        </button> : null
      }
    </div>
  );
}

export default App