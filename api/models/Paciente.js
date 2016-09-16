/**
 * Paciente.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName:'pacientes',
  attributes: {
    paciente_doc: {type: 'string'},
    paciente_nombre1: {type: 'string'},
    paciente_nombre2: {type: 'string'},
    paciente_apellido1: {type: 'string'},
    paciente_apellido2: {type: 'string'},
    paciente_direccion: {type: 'string'},
    paciente_telef: {type: 'string'},
    contrato: {type: 'string'},
    paciente_fecha_nac: {type: 'datetime'},
    sexo: {type: 'string'},
    escolaridad: {type: 'string'},
    estado_civil: {type: 'string'},
    edad: {type: 'string'},
    etnia: {type: 'string'},
    riesgo_cardiaco: {type: 'integer'}
  }
};

