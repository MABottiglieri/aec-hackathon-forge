var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
  Anagrafica: {
    Nascita: {
      Data: { type: String, default:null },
      Luogo: { type: String, default:null },
      NazioneCodice: { type: String, default:null },
      NazioneDescrizione: { type: String, default:null }
    },
    CodiceFiscale: { type: String, default:null },
    Genere: { type: String, default:null },
    Anni: { type: String, default:null }
  },
  Certificazioni:{
    Altre:{ type: String, default:null },
    Lingue:{ type: String, default:null }
  },
  Cognome:{ type: String, required: true, default:null },
  Nome:{ type: String, required: true, default:null },
  NomeIntero:{ type: String, default:null },
  nameId:{ type: String, default:null },
  image:{ type: String, default:null },
  TimeStampGoogleForm:{ type: String, default:null},
  Formazione:{
    AnnoDiLaurea:{ type: String, default:null},
    Istituto:{ type: String, default:null},
    TitoliDiStudio:{ type: String, default:null},
  },
  Lingue:{
    list:[{
      lingua:{ type: String, default:null },
      Comprensione:{ type: String, default:null },
      Parlato:{ type: String, default:null },
      ProduzioneScritta:{ type: String, default:null }
    }],
    Altre:{ type: String, default:null }
  },
  Professione:{
    Albo:{
      Albo:{ type: String, default:null },
      AlboAdHoc:{ type: String, default:null },
      DataEsameDiStato:{ type: String, default:null },
      Provincia:{ type: String, default:null },
      Matricola:{ type: String, default:null }
    },
    PartitaIVA:{ type: String, default:null },
    EsperienzaPrecedente:{
      Esperienza01:{
        Azienda:{ type: String, default:null },
        BreveDescrizione:{ type: String, default:null },
        DataInizio:{ type: String, default:null },
        DataFine:{ type: String, default:null },
        Ruolo:{ type: String, default:null },
      },
      Esperienza02:{
        Azienda:{ type: String, default:null },
        BreveDescrizione:{ type: String, default:null },
        DataInizio:{ type: String, default:null },
        DataFine:{ type: String, default:null },
        Ruolo:{ type: String, default:null },
      },
      Esperienza03:{
        Azienda:{ type: String, default:null },
        BreveDescrizione:{ type: String, default:null },
        DataInizio:{ type: String, default:null },
        DataFine:{ type: String, default:null },
        Ruolo:{ type: String, default:null },
      }
    },
    Lombardini22:{
      Area:{ type: String, default:null },
      Azienda:{ type: String, default:null },
      BreveDescrizione:{ type: String, default:null },
      CodiceAdHoc:{ type: String, required: true, unique: true },
      DataAssunzioneAdHoc:{ type: String, default:null},
      DataFineRapportoAdHoc:{ type: String, default:null},
      DivisionediAppartenenza:{ type: String, default:null},
      MacroArea:{ type: String, default:null},
      RuoloAdHoc:{ type: String, default:null},
      RuoloGoogleForm:{ type: String, default:null},
      Servizio:{ type: String, default:null},
      ServizioDescrizione:{ type: String, default:null},
      email:{ type: String, default:null}
    }
  },
  Software:[{
    name:{ type: String, default:null },
    value:{ type: String, default:null }
  }],
  poll:{
    LastUpdate:{ type: String, default:null},
    ValutazioneGenerale:{
      soci:{ type: Object, default:null},
      media:{ type: String, default:null},
      LastUpdate:{ type: String, default:null}
    },
    ValutazioneGeneraleCapiProgetto:{
      soci:{ type: Object, default:null},
      media:{ type: String, default:null},
      LastUpdate:{ type: String, default:null}
    },
    ValutazioneGeneraleCapiProgettoDEGW:{
      soci:{ type: Object, default:null},
      media:{ type: String, default:null},
      LastUpdate:{ type: String, default:null}
    },
    ValutazioneGeneraleCapiProgettoIngegneria:{
      soci:{ type: Object, default:null},
      media:{ type: String, default:null},
      LastUpdate:{ type: String, default:null}
    }
  }
});

module.exports = {employeeSchema};
// var employee = mongoose.model('employees', employeeSchema);
// module.exports = {employee};
