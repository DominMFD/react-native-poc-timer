# Poc-timer

## Resumo

Foi proposto uma prova de conceito utilizando React-Native, Expo e NativeWind para implementar um caso de uso especifico onde os requisitos eram: 
- Ter iniciar um treino, começar um timer de hh:min:seg.
- Ter uma todo list com alguns exercícios e ser possível marcar como feito.
- Botão para finalizar o treino montando um objeto com as informações(tempo que levou, exercícios feitos e não feitos).

## Dependências

As dependências usadas nessa prova de conceito foram:
- react-native: 0.73.4
- react: 18.2.0
- expo: 50.0.7
- expo-status-bar: 1.11.1
- expo-checkbox: 2.7.0
- moment: 2.30.1
- nativewind: 2.0.11

As dependências de desenolvvimento foram:
- babel/core: 7.20.0
- types/react: 18.2.5
- tailwindcss: 3.3.2
- typescript: 5.1.3


## Desenvolvimento

Chegando na parte do desenvolvimento, primeiramente criei um componente <b>Botão</b> pois já sabia que reutilizaria ele algumas vezes, porem, ele foi o meu único componente pois queria fazer algo bem simples. 

O componente botão foi bem simples, ele contém apenas um <b>TouchableOpacity</b> e um <b>Text</b> para conter o titulo do botão que é passado de forma dinâmica pela propriedade <b>label</b> 

```tsx
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

type ButtoProps = TouchableOpacityProps & {
    label: string
}
  
export default function Button({label, ...rest}: ButtoProps) {
    return (
        <TouchableOpacity
        className="bg-slate-950 rounded-md items-center justify-center p-3"
        activeOpacity={0.8}
        {...rest}>
            <Text
            className="text-lime-400 text-xl mx-5 font-bold">
            {label}
            </Text>
        </TouchableOpacity>
    )
}
```

O próximo passo foi pensar como eu faria um Timer, já que nunca tinha feito antes. Então após uma pesquisa encontrei o <b>moment js</b>, que é uma biblioteca para manipular datas e tempos em display. Após isso comecei a fazer á lógica do Timer.

Primeiramente eu criei um estado utilizando o <b>useState</b> para armazenar e renderizar o valor do tempo decorrido.

```javascript
const [timeRunning, setTimeRunning] = useState<number>(0);
```

Também usei o <b>useState</b> para verificar através de um booleano se a contagem começou ou não.

``` javascript
const [isStart, setIsStart] = useState<boolean>(false);
```

Depois utilizei o <b>useEffect</b> para somar + 1 no <b>timeRunning</b> a cada 1 segundo através do <b>setInterval</b>.

```jsx
useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStart) {
      interval = setInterval(() => {
        setTimeRunning((timePrev) => timePrev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStart]);
```

Esse useEffect é acionado cada vez que o valor de <b>isStart</b> mudar, então a partir disso criei um botão para iniciar o timer.  Para esse botão criei a função <b>handleStartTraining</b>, ela verifica se o <b>isStart</b> é falso e se for falso muda o valor dele para verdadeiro, chamando assim o useEffect e começando a contagem.

```javascript
const handleStartTraining = () => {
    if (!isStart) {
      setIsStart(true);
    }
  };
```

Agora com o tempo correndo, é hora de formatar ele pro display em HH:MM:SS usando o moment js.

```tsx
<Text className="text-lime-400 text-6xl mx-5 font-bold my-2">
        {moment.utc(timeRunning * 1000).format("HH:mm:ss")}
      </Text>
```

O próximo passo foi fazer a todo list, a primeira coisa foi criar um arquivo contendo um array de objetos que são os exercicios.

```typescript
export const Exercises = [
    {
        "id": 0,
        "name": "Leg Press",
    },
    {
        "id": 1,
        "name": "Supino Reto",
    },
    {
        "id": 2,
        "name": "Remada na máquina",
    },
    {
        "id": 3,
        "name": "Desenvolvimento",
    },
    {
        "id": 4,
        "name": "Abdominal no solo",
    }
]
```

Para me auxiliar nessa parte eu criei a variável <b>exercisesStatus</b> que consiste em um array de propriedades utilizando index signature para ser o nome de um exercício com valor booleano para saber se está feito ou não. 

Logo após criei um objeto initialExerciseStatus para me auxiliar a iniciar todos os exercícios como falsos, pois estava com problema deles começarem como undefined. E passei os exercicios por um foreach para atribuir todos como falso e depois atribuir o <b>initialExerciseStatus</b> como valor inicial para <b>exerciseStatus</b>.

```typescript
type ExercisesStatus = {
  [exerciseName: string]: boolean;
};

const initialExercisesStatus: { [key: string]: boolean } = {};
  Exercises.forEach((exercise) => {
    initialExercisesStatus[exercise.name] = false;
  });

const [exercisesStatus, setExercisesStatus] = useState<ExerciseStatus>(initialExerciseStatus);

```

Para a todo list eu criei um checkbox para cada exercício utilizando map, para marcar os exercícios feitos. Para alterar o valor booleano do <b>exerciseStatus</b> eu criei a função <b>handleCheckboxChange</b> que é chamada no clique do checbox.

Essa função recebe uma string como parâmetro que é o nome do exercício que esta associado ao checkbox, nela chamamos o <b>setExerciseStatus</b> que é responsável por mudar o valor do <b>exerciseStatus</b>, nele recebemos os valores anteriores e invertemos o valor do exercício correspondente.

```typescript
	const handleCheckboxChange = (exerciseName: string) => {
    setExerciseStatus((prev) => ({
      ...prev,
      [exerciseName]: !prev[exerciseName],
    }));
  };
```

Para finalizar o exercício foi criado um botão de finalizar exercício e também a função <b>handleFinishTraining</b> para ser chamada em seu clique. Essa função é responsável por finalizar o treino e criar o objeto necessário contendo exercícios feitos, exercícios não feitos e o tempo que durou o treino.

Para auxiliar nessa função foram criadas duas variáveis, <b>exercisesDone</b> e <b>exercisesNotDone</b> para armazenar os exercícios feitos e os exercícios não feitos respectivamente. Com isso a função <b>handleFinishTraining</b> temos o <b>setExercisesDone</b> recebendo as chaves do <b>exerciseStatus</b> que estão com o valor true, e temos também o <b>setExercisesNotDone</b> recebendo as chaves com os valores falsos. Logo após na mesma função temos o <b>setIsStart</b> recebendo false para indiciar que o treino acabou e temos <b>setExercisesStatus</b> recebendo <b>initialExerciseStatus</b> novamente para 'resetar' os status dos exercícios. 

```typescript
const handleFinishTraining = () => {
    setExercisesDone(
      Object.keys(exercisesStatus).filter(
        (exerciseName) => exercisesStatus[exerciseName]
      )
    );
    setExercisesNotDone(
      Object.keys(exercisesStatus).filter(
        (exerciseName) => !exercisesStatus[exerciseName]
      )
    );
    setIsStart(false);
    setExercisesStatus(initialExerciseStatus);
  };
```

Para finalizar criamos a variável <b>trainingReport</b> que é o objeto que queremos, então para passar os valores para ela foi criado um <b>useEffect</b> que é chamado na alteração de valor do <b>exercisesDone</b> e <b>exercisesNotDone</b>. Esse useEffect chama o <b>setTrainingReport </b> que recebe os valores de <b>timeRunning</b>, <b>exercisesDone</b> e <b>exercisesNotDone</b>. Por fim ele tem <b>setTimeRunning</b> recebendo 0 para resetar a contagem.

```typescript
useEffect(() => {
    setTrainingReport({
      timer: timeRunning,
      exercisesDone: exercisesDone,
      exercisesNotDone: exercisesNotDone,
    });
    setTimeRunning(0);
  }, [exercisesDone, exercisesNotDone]);
```

E assim está terminado a prova de conceito, fiz da maneira mais simples possível e focando só na lógica do problema.

## Referências e materiais de estudos

- https://momentjs.com
- https://docs.expo.dev/versions/latest/sdk/checkbox/
- https://mariocoxe0.medium.com/como-criar-um-cronômetro-com-react-native-c252c0534873