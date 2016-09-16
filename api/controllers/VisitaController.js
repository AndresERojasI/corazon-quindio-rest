/**
 * VisitaController
 *
 * @description :: Server-side logic for managing visitas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Obtiene la última visita registrada
   * @param req
   * @param res
   */
  getLatestVisita : function (req, res) {

    var documento = req.param('id');
    if (documento == undefined) {
      return res.send(404,{error: 'error - no se envió un documento de identidad de paciente'});
    }

    Visita.find({paciente_doc: "'" + documento + "'"})
      .sort('fecha_atencion DESC')
      .limit(1)
      .then(function (visita) {
        res.json(visita[0]);
      })
      .catch(function (error) {
        return res.send(404,{error: 'error - no se ha encontrado visitas del paciente con ese número de documento'});
      });
  }
};

