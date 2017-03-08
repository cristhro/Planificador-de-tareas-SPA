var _ = require("underscore");
var moment = require("moment");
/* 
 * To change this licens header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Representacion de los horas
 *  0: '0000-1100'
 1: '1100-1200'
 2: '1100-1800'
 3: '1800-1900'
 4: '1800-2000'
 5: '2000-2400'
 * @param {type} hora_ini
 * @returns {Array|nm$_tools.getIntervalos.seccion|getIntervalos.seccion}
 */
var horas = [
    {ini: 0000, fin: 1100}, // 0
    {ini: 1100, fin: 1200}, // 1
    {ini: 1100, fin: 1800}, // 2
    {ini: 1800, fin: 1900}, // 3
    {ini: 1800, fin: 2000}, // 4
    {ini: 2000, fin: 2400}  // 5
];

/**
 * Funcion que devuelve un array con todos las horas ocupados por un curso,
 *  donde cada elemento contiene (id_curso *10) + siccionOcupada, es decir el ultimo digito es la seccion ocupada
 * @param {type} hora_ini
 * @param {type} hora_fin
 * @returns {Array|nm$_tools.getIntervalos.seccion|getIntervalos.seccion}
 */
function getIntervalosOcupados(hora_ini, hora_fin, id_curso) {
    var seccion = [];

    horas.forEach(function (inter, i) {
        if ((hora_ini >= inter.ini && hora_ini < inter.fin) ||
                (hora_fin > inter.ini && hora_fin <= inter.fin) ||
                ((hora_fin > inter.fin) && (inter.ini > hora_ini))) {

            seccion.push((id_curso * 10) + i);
        }
        ;
    });
    return seccion;
}
function getHorario(datos_curso, datos_horario, fecha) {
    moment.locale('ES');
    var lunes = moment(fecha.lunes);
    var domingo = moment(fecha.domingo);
    
    var horarioSemana = {};
    console.log(lunes);
    console.log(domingo);
    // RECORREMOS LAS CURSOS
    _.each(datos_curso, function (curso, i) {
        console.log(curso);
        // COMPROBAMOS LAS HORAS EN LAS QUE SE DARA EL CURSO
        var isIniInWeek = moment(curso.fecha_inicio).isBetween(lunes, domingo,null, []);
        var diaIni = curso.fecha_inicio.getDay(); // 0-6
        var isFinInWeek = moment(curso.fecha_fin).isBetween(lunes, domingo, null, []);
        var diaFin = curso.fecha_fin.getDay() ; // 0-6
        var allDays = ((lunes.isAfter(moment(curso.fecha_inicio)) && (moment(curso.fecha_fin).isAfter(domingo))));
        
        // MODIFICA EL VALOR DEL DIA DOMINGO (0) POR 7  asi en las comparaciones no habra problemas
        if(0 === diaIni) diaIni = 7;
        if(0 === diaFin) diaFin = 7;
        //***********************************************************************
        // OBTENEMOS LOS HORARIOS DEL CURSO
        var horario_curso = _.where(datos_horario, {id_curso: curso.id_curso});

        // RECORREMOS LAS HORAS DEL HORARIO DE UN CURSO
        horario_curso.forEach(function (diaHorario, i) {
            // Obtenemos el dia de la semana 
            var dia = diaHorario.dia_semana;
            var numDia = getNumDia(diaHorario.dia_semana);
            var hIni = Number(diaHorario.hora_inicio.replace(":", ""));
            var hFin = Number(diaHorario.hora_fin.replace(":", ""));
            var horasOcupados;
            var horasOcupadosExistentes;
            var union;
            
           
            //**************************************************************************
            // HAY CUATRO CASOS POSIBLES EN LOS QUE UN CURSO PUEDE DARSE
             if (allDays) {
                // QUE EL CURSO SE IMPARTA DENTRO DE TODO DEL RANGO DE LA SEMANA
                
                // PARA ESE DIA BUSCAMOS LAS HORAS OCUPADOS POR ESE CURSO
                horasOcupados = getIntervalosOcupados(hIni, hFin, curso.id_curso);
                // COJEMOS LAS HORAS OCUPADOS ANTERIORES
                horasOcupadosExistentes = horarioSemana[dia];
                // UNIMOS LAS NUEVOS HORAS CON LOS ANTERIORES
                union = _.union(horasOcupadosExistentes, horasOcupados);
                // PARA CADA DIA AÑADIMOS LO CALCULADO
                horarioSemana[dia] = union;
            }else if (isIniInWeek && isFinInWeek) {
                // QUE EL CURSO COMIENCE Y ACABE EN ESTA SEMANA
                if (diaIni <= numDia && numDia >= diaFin) {
                    horasOcupados = getIntervalosOcupados(hIni, hFin, curso.id_curso);
                    horasOcupadosExistentes = horarioSemana[dia];
                    union = _.union(horasOcupadosExistentes, horasOcupados);
                    horarioSemana[dia] = union;
                }
            } else if (isIniInWeek) {
                // QUE EL CURSO COMIENCE EN UN DIA DE LA SEMANA
                if (diaIni <= numDia) {
                    horasOcupados = getIntervalosOcupados(hIni, hFin, curso.id_curso);
                    horasOcupadosExistentes = horarioSemana[dia];
                    union = _.union(horasOcupadosExistentes, horasOcupados);
                    horarioSemana[dia] = union;
                }
            } else if (isFinInWeek) {
                // QUE EL CURSO FINALICE EN UN DIA DE LA SEMANA
                if (numDia <= diaFin) {
                    horasOcupados = getIntervalosOcupados(hIni, hFin, curso.id_curso);
                    horasOcupadosExistentes = horarioSemana[dia];
                    union = _.union(horasOcupadosExistentes, horasOcupados);
                    horarioSemana[dia] = union;
                }
            }
       
        });
    });
    return {
        horario: horarioSemana, 
        fechas: {  actual:{lunes:lunes, domingo:domingo}, 
                   siguiente:{lunes:moment(lunes).add(7, 'days').format('YYYY-MM-DD'), domingo:moment(domingo).add(7, 'days').format('YYYY-MM-DD')}, 
                   anterior:{lunes:moment(lunes).subtract(7, 'days').format('YYYY-MM-DD'), domingo:moment(domingo).subtract(7, 'days').format('YYYY-MM-DD')}
                }};

}
/**
 * Funcion que devuelve un dia en representacion de enteros
 * @param {type} dia
 * @returns {Number|getNumDia.numero}
 */
function getNumDia(dia){
    var numero;
    switch (dia) {
        case "domingo":
            numero = 7;
            break;
        case "lunes":
            numero = 1;
            break;
        case "martes":
            numero = 2;
            break;
        case "miercoles":
            numero = 3;
            break;
        case "jueves":
            numero = 4;
            break;
        case "viernes":
            numero = 5;
            break;
        case "sabado":
            numero = 6;
            break;
        
        default:
            break;
    }
    return numero;
}

// Exportanción de las funciones de ayuda con arrays
module.exports = {
    getIntervalosOcupados: getIntervalosOcupados,
    getHorario: getHorario
};

