let params = new URLSearchParams(window.location.search);
let precio = Number.parseInt(params.get('precio'));
let anios = Number.parseInt(params.get('anios'));
let interes = Number.parseFloat(params.get('interes'));
let tipoInteres = params.get('tipoInteres');
let cantidadInicial = Number.parseInt(params.get('cantidadInicial'));
let interesMinimo;
let interesMaximo;
let interesMedio;

if(tipoInteres == 'fijo'){
    interesMinimo = interes;
    interesMaximo = interes;
    interesMedio = interes;
} else {
    let interesAnual = simulaInteres(interes,anios);
    interesMinimo = Math.round(interesAnual.reduce((num1, num2) => num1 >= num2 ? num2 : num1) * 100) / 100;
    interesMaximo = Math.round(interesAnual.reduce((num1,num2) => num1 <= num2 ? num2 : num1) * 100) / 100;
    interesMedio = Math.round(interesAnual.reduce(((num1,num2) => num1 + num2)) / interesAnual.length * 100) / 100;
}

let pagoMedio = Math.round(((precio - cantidadInicial) + (interesMedio / 100 * (precio - cantidadInicial))) / anios / 12 * 100) / 100;
let pagoMaximo = Math.round(((precio - cantidadInicial) + (interesMaximo / 100 * (precio - cantidadInicial))) / anios / 12 * 100)/100;
let pagoMinimo = Math.round(((precio - cantidadInicial) + (interesMinimo / 100 * (precio - cantidadInicial))) / anios / 12 * 100) / 100;
let ingresosMensuales = params.get('ingresosMensuales');
//Recomendación
if (ingresosMensuales != null && ingresosMensuales != ''){
    ingresosMensuales = Number.parseInt(ingresosMensuales);
    let hipotecaAsumible = hipotecaAsequible(ingresosMensuales,pagoMedio,pagoMaximo);
    document.getElementById('caracteristicasMonetarias').innerHTML = `<h2> Tus caracteristicas económicas</h2> <p>Tus ingresos mensuales son ${ingresosMensuales} €</p> <p>El máximo que puedes gastar al mes en hipoteca son ${ingresosMensuales * 0.3} €</p>`;
    if (hipotecaAsumible == 1) document.getElementById('recomendacion').innerHTML = `<h2>Recomendación</h2> <p>Puedes asumir perfectamente esta hipoteca</p>`;
    else if (hipotecaAsumible == 2) document.getElementById('recomendacion').innerHTML = `<h2>Recomendación</h2> <p>Puedes asumir esta hipoteca pero si el interes sube mucho corres riesgo</p>`;
    else document.getElementById('recomendacion').innerHTML = `<h2>Recomendación</h2> <p>No tienes los recursos economicos para asumir esta hipoteca con seguridad los ingresos mensuales optimos son ${Math.round(pagoMaximo / 0.3)} €</p>`;
}
//Pintar todo
document.getElementById('caracteristicasHipoteca').innerHTML =`<h2> hipoteca seleccionada </h2> <p>${Math.round(((precio - cantidadInicial) + (interesMedio / 100 * (precio - cantidadInicial))) * 100) / 100} € a pagar</p> <p>${anios} años de hipoteca</p> <p>interes ${tipoInteres}</p> ${(tipoInteres == 'fijo' ? `<p> interes del ${interes} % </p><p>pago mensual de ${pagoMedio} €</p>` : `<p> interes inicial del ${interes} % </p><p>Pago mensual medio de ${pagoMedio} €</p> <p> interes maximo del ${interesMaximo} % </p> <p>Pago mensual maximo de ${pagoMaximo} €</p> <p> interes minimo del ${interesMinimo} % </p> <p>Pago mensual minimo de ${pagoMinimo} €</p>`)} `;


//Devuelve interes o una simulación del interes
function simulaInteres(interes,anios){
    let intereses = [interes];
    for(i = 1; i < anios ; i++){
        let variacion = Math.random() * 0.6 * (Math.random() >= 0.5 ? 1 : -1);
        intereses.push(intereses.at(i - 1) + variacion);
    }
    return intereses;
}
//1 = Si, 2 = poco riesgo, 3 = no asumible
function hipotecaAsequible(ingresosMensuales, pagoMedio, pagoMaximo){
    if (ingresosMensuales * 0.3 > pagoMaximo ) return 1;
    if (ingresosMensuales * 0.3 > pagoMedio  && ingresosMensuales * 0.3 <= pagoMaximo) return 2;
    return 3;
}