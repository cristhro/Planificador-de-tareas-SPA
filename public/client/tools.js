
function cambiarFormatoFecha(fechaJson) {

    var fecha = new Date(fechaJson);
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anyo = + fecha.getYear() + 1900;
    
    return dia + "/" +  mes+"/" + anyo ;
}
function getLetraDia(dia){
    var letra;
    switch (dia) {
        case "lunes":
            letra = "l";
            break;
        case "martes":
            letra = "m";
            break;
        case "miercoles":
            letra = "x";
            break;
        case "jueves":
            letra = "j";
            break;
        case "viernes":
            letra = "v";
            break;
        case "sabado":
            letra = "s";
            break;
        case "domingo":
            letra = "d";
            break;
        default:
            break;
    }
    return letra;
}
