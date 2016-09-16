/**
 * PacienteController
 *
 * @description :: Server-side logic for managing pacientes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Obtiene un paciente por ID
   * @param req
   * @param res
   * @returns {*}
   */
  getPaciente : function(req, res){
    var documento = req.param('id');
    if (documento == undefined) {
      return res.send(404,{error: 'error - no se envió un documento de identidad de paciente'});
    }

	  Paciente.find({paciente_doc: documento}).exec(function (err, paciente) {
      if (err) {
        return res.send(404,{error: 'error - no se ha encontrado paciente con ese número de documento'});
      }

      res.json(paciente);
    });
  },

  /**
   * Obtiene los valores del dashboard
   * @param req
   * @param res
   */
  getPacientesDashboard : function (req, res) {
    // Primero ejecutamos el conteo total de pacientes
    Paciente.query(
      'SELECT COUNT(*), edad FROM pacientes WHERE riesgo_cardiaco >= 10 GROUP BY edad',
      function (err, riskPerAge) {

        if(err){
          return res.send(404,{error: 'error - ha ocurrido un problema, intentalo de nuevo.'});
        }

        Paciente.count({paciente_doc : {'!': null}})
          .then(function (total) {

            if (total == 0){
              return res.send(404,{error: 'error - no hay pacientes'});
            }

            var enRiesgo = Paciente.count({riesgo_cardiaco : {'>=': 10}})
              .then(function (total) {
                return total;
              });

            var sinRiesgo = Paciente.count({riesgo_cardiaco : {'<': 10}})
              .then(function (total) {
                return total;
              });

            return [total, enRiesgo, sinRiesgo];
          })
          .spread(function (total, enRiesgo, sinRiesgo) {
            // Calculamos algunas alertas para ayudar a la visualización
            var alerts = [];
            var percentageRisk = ((enRiesgo * 100)/total).toFixed(2);
            var percentageNoRisk = ((sinRiesgo * 100)/total).toFixed(2);

            if(percentageRisk > percentageNoRisk){
              alerts.push('La cantidad de pacientes en riesgo ('+percentageRisk+'%) es mayor a la de pacientes sin riesgo ('+percentageNoRisk+'%), se recomienda iniciar acciones preventivas');
              if(percentageRisk >= 30){
                alerts.push('La cantidad de pacientes en riesgo es de más de 30%, se recomienda tomar acciones preventivas.')
              }
            }else{
              alerts.push('La cantidad de pacientes en riesgo ('+percentageRisk+'%) es menor a la de pacientes sin riesgo ('+percentageNoRisk+'%), es un resutado positivo');
              if(percentageRisk <= 20){
                alerts.push('La cantidad de pacientes en riesgo es de menor de 20%, el balance es positivo.')
              }
            }

            res.json({total: total, enRiesgo: enRiesgo, sinRiesgo: sinRiesgo, alertas: alerts, riskPerAge: riskPerAge.rows});
          })
          .catch(function (error) {
            console.log(error);
            return res.send(404,{error: 'error - ha ocurrido un error, intente de nuevo'});
          });
      });
  },

  getAllPacientes : function (req, res) {
    Paciente.find({})
      .then(function (result) {
        res.json(result);
      })
      .catch(function (error) {
        return res.send(404,{error: 'error - no se ha podido obtener la lista'});
      });
  },

  updatePaciente: function (req, res) {
    var documento = req.param('id');
    if (documento == undefined) {
      return res.send(404,{error: 'error - no se envió un documento de identidad de paciente'});
    }

    var porcentaje_riesgo = req.param('porcentaje_riesgo');
    if (porcentaje_riesgo == undefined) {
      return res.send(404,{error: 'error - no se envió un porcentaje de riesgo'});
    }

    Paciente.update({paciente_doc : documento }, {riesgo_cardiaco: porcentaje_riesgo})
      .then(function(result){
        res.json(result);
      })
      .catch(function (error) {
        return res.send(404,{error: 'error - no se actualizó paciente'});
      });
  }
};

