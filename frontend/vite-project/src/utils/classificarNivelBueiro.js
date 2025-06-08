export function calcularPercentual(distancia, distanciaMax = 110) {
    return Math.max(0, Math.min(100, ((distanciaMax - distancia) / distanciaMax) * 100));
}

export function classificarBueiro(distancia, distanciaMax = 110) {
    const percentual = calcularPercentual(distancia, distanciaMax);

    if (percentual <= 30) return "limpo";
    if (percentual <= 60) return "parcial";
    return "cheio";
}