import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import Button from "./src/components/Button";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Exercises } from "./src/services/exercises";
import Checkbox from "expo-checkbox";

type ExercisesStatus = {
  [exerciseName: string]: boolean;
};

type TrainingReport = {
  timer: number;
  exercisesDone: string[] | undefined;
  exercisesNotDone: string[] | undefined;
};

export default function App() {
  const [timeRunning, setTimeRunning] = useState<number>(0);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const initialExercisesStatus: { [key: string]: boolean } = {};

  Exercises.forEach((exercise) => {
    initialExercisesStatus[exercise.name] = false;
  });

  const [exercisesStatus, setExercisesStatus] = useState<ExercisesStatus>(initialExercisesStatus);
  const [exercisesDone, setExercisesDone] = useState<string[]>();
  const [exercisesNotDone, setExercisesNotDone] = useState<string[]>();
  const [trainingReport, setTrainingReport] = useState<TrainingReport>();

  const handleStartTraining = () => {
    if (!isStart) {
      setIsStart(true);
    }
  };

  const handleCheckboxChange = (exerciseName: string) => {
    setExercisesStatus((statusPrev) => ({
      ...statusPrev,
      [exerciseName]: !statusPrev[exerciseName],
    }));
  };

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
    setIsFinished(true);
    setIsStart(false);
  };

  useEffect(() => {
    setTrainingReport({
      timer: timeRunning,
      exercisesDone: exercisesDone,
      exercisesNotDone: exercisesNotDone,
    });
    setTimeRunning(0);

    return () => setExercisesStatus(initialExercisesStatus);
  }, [exercisesDone, exercisesNotDone]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isStart) {
      interval = setInterval(() => {
        setTimeRunning((timePrev) => timePrev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isStart]);

  if (isFinished) {
    return (
      <View className="justify-center items-center bg-[#1f1e1e] flex-1 gap-6 text-lime-400">
        <Text className="text-lime-400 text-3xl mx-5 font-bold my-2">
          Resumo de Treino:
        </Text>
        <Text className="text-lime-400 text-2xl">
          Duração:{" "}
          {trainingReport &&
            moment.utc(trainingReport.timer * 1000).format("HH:mm:ss")}
        </Text>
        <View className="justify-between items-start flex-row">
          <View>
            <Text className="text-lime-400 text-xl">Exercicios feitos:{" "}</Text>
          </View>
          <View>
            {trainingReport?.exercisesDone?.map((exercise) => (
            <Text key={exercise} className="text-lime-400 text-xl">{exercise}</Text>))}
          </View>
        </View>
        <View className="justify-between items-start flex-row">
          <View>
            <Text className="text-lime-400 text-xl">Exercicios feitos:{" "}</Text>
          </View>
          <View>
            {trainingReport?.exercisesNotDone?.map((exercise) => (
            <Text key={exercise} className="text-lime-400 text-xl">{exercise}</Text>))}
          </View>
        </View>
        <Button label="Ir para Pagina Inicial" onPress={() => setIsFinished(false)} />
      </View>
    );
  }

  return (
    <View className="justify-center flex-1 items-center align-middle bg-[#1f1e1e]">
      <Text className="text-lime-400 text-6xl mx-5 font-bold my-2">
        {moment.utc(timeRunning * 1000).format("HH:mm:ss")}
      </Text>
      {isStart && (
        <View className="justify-between items-center self-center rounded-md">
          <Text className="text-lime-400 text-xl mx-5 font-bold">
            Selecione os treinos feitos:
          </Text>
          <View className="p-2 mt-5">
            {Exercises.map((exercise) => (
              <View
                key={exercise.id}
                className="justify-start items-center flex-row gap-5"
              >
                <Checkbox
                  value={exercisesStatus[exercise.name]}
                  onValueChange={() => handleCheckboxChange(exercise.name)}
                  color={"rgb(163, 230, 53)"}
                />
                <Text className="text-lime-400 font-semibold text-lg text-start">
                  {exercise.name}
                </Text>
              </View>
            ))}
          </View>
          <Button label="Finalizar treino" onPress={handleFinishTraining} />
        </View>
      )}
      {!isStart && (
        <Button label="Começar Treino" onPress={handleStartTraining} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

