const nodemailer = require('nodemailer');
var http = require('http').Server();
var client = require('socket.io').listen(8081).sockets;
var User = require('./models/users');
var Request = require('./models/request');
var Lpo = require('./models/lpo');
var Ins = require('./models/inspection');
var Receipt = require('./models/receipts');
var Quotation = require('./models/quotation');
var Delivery = require('./models/delivery');
var multer = require('multer');
var Note = require('./models/notifications');
var fs = require('fs');
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        var extArray = file.mimetype.split("/");
        var extension = extArray[1];
        callback(null, file.fieldname + '_'+Date.now()+'.'+extension);
    }

});
var upload = multer({ storage : storage}).single('swiftify');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'dedandocuments@gmail.com',
        pass: 'dedankimathi'
    }
});
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send('Error 404: Page not found.');
    });
    app.post('/imageUpload', function(req, res) {
        upload(req, res, function (err) {
            if (err)
                console.log(err);
            else
                var pic = 'uploads/' + req.file.filename;
            var businessName = req.body.userId;
            var module = req.body.action;
            if (module == 'profile') {
                res.status(201).json(pic);
                User.findOne({'businessName': businessName}, function (err, user) {
                    if (err)
                        throw err;
                    else {
                        var imageurl = user.pic;
                        var imagefolder = imageurl.split('/');
                        if (imagefolder[0] == 'uploads') {
                            fs.unlink('public/' + imageurl, function () {
                            });
                        }
                    }
                });
                User.updateOne({'businessName': businessName}, {$set: {'pic': pic}}, function (err) {
                    if (err)
                        throw err;
                });
                Request.update({'businessName': businessName},
                    {$set: {'pic': pic}},{multi: true}, function (err, res) {
                    if (err)
                        throw err;
                });
                Request.update({proposals: {$elemMatch:{'name': businessName}}},
                    {$set: {'proposals.$.image': pic}},{multi: true}, function (err) {
                        if (err)
                            throw err;
                    });
                Note.update({'from.name': businessName},
                    {$set: {'from.pic': pic}},
                    {multi: true}, function (err) {
                        if (err)
                            throw err;
                });
            }
        });
    });
    client.on('connection',function(socket)
    {

        socket.on('appData',function(data){
            data = data.data;
            var module = data.module;
            var info = data.data;
            var credentials = data.credentials;

            switch(module){
                case 'fetchDocument':
                    var Col;
                    var criteria1;
                    switch(data.item){
                        case 'request':
                            criteria1 = {'dateCreated': data.serial};
                        Col = Request;
                        break;

                        default:
                            criteria1 = {'serial': data.serial};
                        break;
                    }
                    Col.findOne(criteria1, function (err, doc) {
                        if(err)
                            throw err;
                        else{
                            socketResponse(socket, {
                                module: 'request',
                                submodule: 'fetchDocument',
                                doc: doc,
                                type: data.item
                            }, null);
                        }
                    });
                    Note.updateOne({'dateCreated': data.date, toId: data.businessName},
                        {$set: {'read': true}},
                        function(err, res){
                        if(err)
                            throw err;
                    });
                    break;
                case 'notification':
                    switch(data.action){
                        case 'fetch':
                            User.findOne({'businessName': data.userId}, {notifications: 1, pic: 1},
                                function (err, res) {
                               if(err)
                                   throw err;
                               else if(res){
                                   socketResponse(socket, {
                                       module: 'notification',
                                       submodule: 'fetch',
                                       number: res.notifications,
                                       pic: res.pic
                                   }, null);
                               }
                            });
                            break;

                    }
                    break;
                case 'rating':
                    var ins = data.ins;
                    ins.rated = true;
                    ins.dateCreated = Date.now();
                    Ins.findOne({'serial':ins.serial},function (err, res) {
                       if(err)
                           throw err;
                       else if(!res){
                           var newIns = new Ins();
                           newIns.serial = ins.serial;
                           newIns.to = ins.to;
                           newIns.from = ins.from;
                           newIns.approvedBy = ins.approvedBy;
                           newIns.items = ins.items;
                           newIns.rated = ins.rated;
                           newIns.dateCreated = ins.dateCreated;
                           newIns.save(function (err) {
                               if(err)
                                   throw err;
                               else
                                   socketResponse(socket, {
                                       module: 'invoice',
                                       submodule: 'rating',
                                       ins: ins
                                   }, null);
                           });
                       }else{
                           socketResponse(socket, {
                               module: 'invoice',
                               submodule: 'rating'
                           }, null);
                       }
                    });
                    break;
                case 'createDelivery':
                    var q = data.deliveryNote;
                    Delivery.findOne({'serial': q.serial}, {delivers: 0, from:0, to:0}, function (err, res) {
                        if(err)
                             throw err;
                        else if(res){
                            Delivery.updateOne({'serial': q.serial}, {$push: {delivers: q.newDel}},
                                function (err) {
                                    if(err)
                                         throw err;
                                    else socketResponse(socket, {
                                        module: 'invoice',
                                        submodule: 'updatedDelivery',
                                        del: q.newDel
                                    }, null);
                                })
                        }else{
                            var newDelivery = Delivery();
                            newDelivery.serial = q.serial;
                            newDelivery.dateCreated = Date.now();
                            newDelivery.to = q.to;
                            newDelivery.from = q.from;
                            newDelivery.delivers = [
                                q.newDel
                            ];
                            newDelivery.save(function (err) {
                                if(err)
                                    throw err;
                                else{
                                    socketResponse(socket, {
                                        module: 'invoice',
                                        submodule: 'updatedDelivery',
                                        del: q.newDel
                                    }, null);
                                }
                            });
                        }
                    });

                      break;
                case 'updatePayment':
                    Receipt.updateOne({'serial':data.serial, 'dateCreated': data.dateCreated},
                        {$set: {confirmed: true}},function (err) {
                        if(err)
                             throw err;
                    socketResponse(socket, {
                                module: 'invoice',
                                submodule: 'updatedReceipt'
                            }, null);
                    });
                    break;
                case 'sendingReceipt':
                      var newReceipt = new Receipt();
                    newReceipt.to = data.to;
                    newReceipt.from = data.from;
                    newReceipt.dateCreated = Date.now();
                    newReceipt.serial = data.serial;
                    newReceipt.amount = data.amount;
                    newReceipt.save(function (err) {
                       if(err)
                            throw err;
                       else
                           Lpo.updateOne({'serial': data.serial, info: {$elemMatch: {email: {$in: [data.to.email, data.from.email]}}}},
                           {$set: {'info.$.receipt': true}},function (err,res) {
                               if(err)
                                   throw err;
                           });
                           socketResponse(socket, {
                           module: 'invoice',
                           submodule: 'savedReceipt',
                           receipt: newReceipt
                       }, null);
                    });
                    break;
                case 'fetchInvoice':
                    var criteria;
                    var person;
                     if(data.user == data.invoiceInfo.creator){
                         person = data.invoiceInfo.to;
                     }else{
                         person = data.invoiceInfo.creator;
                     }
                        criteria = {'info.email':data.invoiceInfo.to, 'Id': data.invoiceInfo.creator}
                    Lpo.aggregate([
                        {$unwind:"$info"},
                        {$match: criteria},
                        {$group:{
                                _id:{id:"$_id", "id":"$info._id"},
                                "info":{$push:"$info"}
                            }}
                    ]).exec(function (err, res) {
                        if(err)
                            throw err;
                        else {
                            var invoice = res[0].info[0];
                            User.findOne({email: person}, {businessName: 1, phone:1, email:1,'address.street':1, _id: 0}, function(err, user){
                                if(err)
                                    throw err;
                                else{
                                    var del = '';
                                    Delivery.findOne({'serial':data.invoiceInfo.serial}, {serial:1},function (err, del) {
                                        if(err)
                                            throw err;
                                        else{
                                            if(del){
                                                del = true;
                                            }
                                            socketResponse(socket, {
                                                module: 'invoice',
                                                submodule: 'invoiceFound',
                                                invoice: invoice,
                                                person: user,
                                                del: del
                                            }, null);
                                        }
                                    });

                                }
                            });
                        }
                    });
                    break;
                case 'updateInvoice':
                    var date = Date.now();
                   Lpo.updateOne({'serial': data.lpoId, info: {$elemMatch: {email: data.user}}},
                      {$set: {'info.$.invoiced': true, 'info.$.dateInvoiced': date}}, function (err) {
                           if(err)
                                throw err;
                           else
                               socketResponse(socket, {
                                   module: 'invoice',
                                   submodule: 'invoiceSent'
                               }, null);
                       } );
                    break;
                case 'getInvoDetails':
                    User.findOne({email: data.user}, {businessName: 1, phone:1, email:1,'address.street':1, _id: 0}, function(err, user){
                        if(err)
                             throw err;
                        else{
                            socketResponse(socket, {
                                module: 'invoice',
                                submodule: 'checkSender',
                                res: user
                            }, null);
                        }
                    });
                    break;
                case 'createLPO':
                         Lpo.findOne({serial: data.id}, function (err, res) {
                       var response;
                       if(err)
                            throw err;
                       else if(res){
                           response = 'LPO with same reference exists';
                       }else{
                           var info = [];
                           data.biders.forEach(function (value) {
                               info.push({
                                   vendorName: value.inputs[0].ngBind,
                                   email: value.inputs[1].ngBind,
                                   top: value.inputs[2].ngBind,
                                   pod: value.inputs[3].ngBind,
                                   dor: value.inputs[4].ngBind,
                                   items: value.items,
                                   TotalValue: value.amount,
                                   AmountInWords: value.amntWords
                               })
                           });
                           var newLpo = new Lpo();
                           newLpo.serial = data.id;
                           newLpo.info = info;
                           newLpo.approvals = [{name: data.approvement[0].bind},{name: data.approvement[1].bind}];
                           newLpo.approvedDate = data.approvement[2].bind;
                           newLpo.Id = data.owner;
                           newLpo.save(function (err) {
                               if(err)
                                   throw err;
                           });
                               response = 'Your LPO has been sent';
                           }
                           socketResponse(socket, {
                               module: 'quotation',
                               submodule: 'sentLPO',
                               res: response
                           }, null);
                       });
                     break;
                case 'updateQuotation':
                           Quotation.updateOne({'id':data.quotation}, {$push:{
                                   biders: {
                                       id: data.myId,
                                       items: data.items
                                   }
                               }}, function (err) {
                               if(err)
                                    throw err;
                               else
                                   socketResponse(socket, {
                                   module: 'quotation',
                                   submodule: 'quoted'
                               }, null);
                           });
                    break;
                case 'checkQuotation':
                    Quotation.findOne({'id': data.id}, function(err, res){
                       if(err)
                            throw err;
                       else{
                           socketResponse(socket, {
                               module: 'quotation',
                               submodule: 'quotationFound',
                               info: res
                           }, null);
                       }
                    });
                    break;
                case 'saveQuotation':
                    var newQuot = new Quotation();
                    var time = Date.now();
                    newQuot.id = time;
                    newQuot.processDate = changeDate(time);
                    newQuot.to = data.tos;
                    newQuot.from = {
                        buyerName: data.businessName,
                        email: data.myId
                    };
                    newQuot.witness = data.approvers;
                    newQuot.items = data.items;
                    newQuot.closed = true;

                    newQuot.save(function (err) {
                       if(err)
                           throw err;
                       else {
                           Request.updateOne({dateCreated: data.quotationId}, {$set: {'quotationId':  newQuot.id}}, function (err) {
                               if(err)
                                   throw err;
                           });
                           socketResponse(socket, {
                               module: 'quotation',
                               submodule: 'newsaved',
                               data: data.approvers,
                               id: data.quotationId,
                               from: newQuot.from,
                               info: {
                                   processDate: newQuot.processDate,
                                   id: newQuot.id
                               }
                           }, null);
                       }
                    });
                    break;
                case 'removeOffer':
                    Request.updateOne({'dateCreated': data.id}, {$pull: {proposals:
                    {'id': data.email}}}, function (err) {
                        if(err)
                             throw err;
                        else{
                            Request.updateOne({'dateCreated': data.id},  {$inc: {'props': -1}}, function (err) {
                                if (err)
                                    throw err;
                            });
                            socketResponse(socket, {
                                module: 'userProposed',
                                submodule: 'offerRemoved',
                                id: data.id
                            }, true);
                                }
                    });
                    break;
                case 'checkProposal':
                    Request.findOne({'dateCreated': data.id, $or:[
                        {proposals: {$elemMatch: {id: data.email}}},
                        {'Id': data.email}]},
                            {proposals: 1}, function (err, res) {
                        if(err)
                             throw err;
                        else{
                            if(res){
                                var proposals;
                                var submodule;
                                if(data.owner == false){
                                    var index = res.proposals.findIndex(k => k.id == data.email);
                                    proposals = res.proposals[index];
                                    submodule = 'requestExists'
                                }else{
                                    proposals = res.proposals;
                                    submodule = 'proposalsFound'
                                }
                                socketResponse(socket, {
                                    module: 'userProposed',
                                    submodule: submodule ,
                                    proposal: proposals
                                }, null);
                            }
                        }
                    });
                    Quotation.findOne({'id': data.quotation, to: {$elemMatch: {id: data.email}}},function (err, res) {
                        if(err)
                            throw err;
                        else if(res){
                            socketResponse(socket, {
                                module: 'userProposed',
                                submodule: 'quotationSent'
                            }, null);
                        }
                    });
                     break;
                case 'saveOffer':
                    Request.updateOne({'dateCreated': data.id}, {$push: {proposals: data.info}},
                        function (err) {
                        if(err)
                            throw err;
                        else{
                            Request.updateOne({'dateCreated': data.id}, {$inc: {'props': 1}},
                                function (err) {
                                if (err)
                                    throw err;
                                else
                                    socketResponse(socket, {
                                        module: 'indexResponse',
                                        submodule: 'offerSent',
                                        req: data.id,
                                        owner: data.info.name
                                    }, true);
                               });
                            }
                    });
                     notification({
                         toId: data.toId,
                         from: {
                             name: data.info.name,
                             email: data.info.email,
                             pic: data.info.pic
                         },
                         serial: data.id,
                         doc: 'request',
                         note: 'Sent an offer to your request.',
                         read: false
                     }, socket);
                    break;
                case 'fetchRequests':
                    var criteria;
                        if(data.value == 'all'){
                            criteria = {quotationId: {$exists: false}};
                        }else{
                            criteria = {quotationId: {$exists: false},'searchTags':  { '$regex' : data.value, '$options' : 'i' }};
                        }
                    Request.find(criteria,{proposals: 0}, function (err, reqs) {
                        if(err)
                             throw err;
                        else if(reqs.length > 0){
                            socketResponse(socket, {
                                module: 'indexResponse',
                                submodule: 'foundReqs',
                                message: reqs
                            }, null);
                        }else{
                            socketResponse(socket, {
                                module: 'indexResponse',
                                submodule: 'foundReqs',
                                message: 'No request found'
                            }, null);
                        }
                    }).sort({$natural: -1});
                       break;
                case 'fetchDocs':
                    var Db;
                    var criteria;
                    switch (data.type){

                        case 'Notifications':
                            Db = Note;
                            criteria = {toId: data.id};
                            User.updateOne({'email': data.email},
                                {$set: {notifications: 0}},
                                function(err){
                                    if(err)
                                        throw err;
                                    else
                                        socketResponse(socket, {
                                            module: 'notification',
                                            submodule: 'read'
                                        }, null);
                                });
                            break;
                        case 'InspectionCertificates':
                            Db = Ins;
                            criteria = {$or:[{'from.email':data.email},{'to.email': data.email}]};
                            break;
                        case 'Quotations':
                            Db = Request;
                            criteria = {'Id': data.email};
                            break;
                        case 'Offers':
                            Db = Request;
                            criteria = {'proposals.id': data.email};
                            break;
                        case 'DeliveryNotes':
                            Db = Delivery;
                            criteria = {$or:[{'from.email':data.email},{'to.email': data.email}]};
                         break;
                        case 'Receipts':
                            Db = Receipt;
                            criteria = {$or:[{'from.email': data.email}, {'to.email':data.email}]};
                            break;
                        case 'LPOs':
                            Db = Lpo;
                            criteria = {$or: [{Id: data.email}, {'info.email': data.email}]};
                         }
                   if(data.type !== 'Invoices') {
                       Db.find(criteria, {proposals: 0}, function (err, reqs) {
                           if (err)
                               throw err;
                           else if (reqs) {

                               socketResponse(socket, {
                                   module: 'request',
                                   submodule: 'showDocs',
                                   docs: reqs,
                                   type: data.type
                               }, null);
                           }
                       }).sort({$natural: -1});
                   }else if(data.type == 'Invoices'){
                              Lpo.find({"info.invoiced": true, $or:[{'info.email':data.email},{'Id': data.email}]}, function(err, res0){
                                  if(err)
                                      throw err;
                                  else if(res0.length > 0){
                                     var invoices = [];
                                      res0.forEach(function (value) {
                                          value.info.forEach(function (value2) {
                                              if(value2.invoiced == true && data.email == value.Id){
                                                  invoices.push({
                                                      dateCreated: value2.dateInvoiced,
                                                      serial: value.serial,
                                                      creator: value.Id,
                                                      to: value2.email
                                                  })
                                              }else if(value2.invoiced == true && data.email !== value.Id && data.email == value2.email){
                                                  invoices.push({
                                                      dateCreated: value2.dateInvoiced,
                                                      serial: value.serial,
                                                      creator: value.Id,
                                                      to: value2.email
                                                  })
                                              }
                                          })
                                      });
                                      socketResponse(socket, {
                                          module: 'request',
                                          submodule: 'showDocs',
                                          docs: invoices,
                                          type: data.type
                                      }, null);
                                  }
                              });
                          }
                     break;
                case 'storeRequest':
                    var newRequest = new Request();
                        newRequest.Id = data.acc;
                        newRequest.title = info.title;
                        newRequest.details = info.details;
                        newRequest.searchTags = info.searchTags;
                        newRequest.location = info.location;
                        newRequest.dateCreated = getTime()[2];
                        newRequest.businessName = data.businessName;
                        newRequest.pic = data.pic;
                        newRequest.proposals = [];
                        newRequest.props = 0;
                        newRequest.save(function (err) {
                            if(err)
                                throw err;
                            else
                                socketResponse(socket, {
                                    module: 'request',
                                    submodule: 'addRequest',
                                    request: newRequest
                                }, null);
                        });
                     break;
                case 'updateProfile':
                    User.updateOne({'email': data.email}, {$set: {
                        'businessName': data.businessName,
                        'phone': parseInt(data.phone),
                        'address': data.address
                        }}, function (err) {
                        if(err)
                            throw err;
                        else{
                            User.findOne({'email': data.email}, function (err, res) {
                                if(err)
                                    throw err;
                                else{
                                    socketResponse(socket, {
                                        module: 'app',
                                        submodule: 'updateProfile',
                                        user: res
                                    }, null)
                                }
                            })
                        }
                    });
                    break;
                case 'updateLog':
                    User.updateOne({'email': data.email},{$set: {'status': 'active'}}, function (err) {
                        if(err)
                             throw err;
                    });
                    break;
                case 'updatePass':
                    var usr = new User();
                     var pass = usr.generatHarsh(data.pass);
                 User.updateOne({'email': data.userId}, {$set: {'password': pass, 'passCode': ''} }, function (err) {
                     if(err)
                         throw err;
                     socketResponse(socket, {
                         module: 'indexResponse',
                         submodule: 'passChanged',
                         message: "Your password has been changed"
                     }, null);
                 });
                    break;
                case 'checkEmail':
                    User.findOne({'email': data.email}, function (err, user) {
                        var message;
                        var error;
                        if(err)
                            throw err;
                        else{
                            if(!user){
                                message = "The email is not registered";
                                error = 'emailError';
                            }else if(!user.passCode) {
                                var random_number = Math.floor((Math.random()) * (999999 - 100000)) + 100000;
                                User.update({'email': data.email}, {$set: {'passCode': random_number}}, function (err) {
                                    if (err)
                                        throw err;
                                });
                                var mailOptions = {
                                    from: 'Swiftify account password reset',
                                    to: user.email,
                                    subject: 'Request for a password reset ✔',
                                    html: 'Your are receiving this for a request on password reset. <br/>Please enter this verification code in order to continue.<br/><strong>' + random_number + '</strong>'
                                };
                                transporter.sendMail(mailOptions, function (error) {
                                    if (error) {
                                        console.log(error);
                                    }
                                });
                                message = random_number;
                            }else{
                               message = user.passCode
                            }
                            socketResponse(socket, {
                                module: 'indexResponse',
                                submodule: 'verification',
                                err: error,
                                message: message
                            }, true);
                        }
                    });
                    break;
                 case 'signUP':
                     User.findOne({'email': credentials[2]}, function(err, user){
                        if(err)
                            throw err;
                        else if(user){
                            socketResponse(socket, {
                                module: 'indexResponse',
                                submodule: 'signUp',
                                err: 'errSignUp',
                                message: 'email is already registered'
                            }, null);
                        }else{
                            var random_number = Math.floor((Math.random()) * (999999 - 100000)) + 100000;
                            var newUser = new User();
                            newUser.Id = getTime()[2];
                            newUser.email = credentials[2];
                            newUser.businessName = credentials[1],
                            newUser.password =  newUser.generatHarsh(credentials[3]);
                            newUser.status = random_number,
                            newUser.readQuotationTerms = false,
                            newUser.address = '';
                            newUser.notifications = 0;
                            newUser.supplier = '';
                            newUser.pic ='images/bigAvatar.JPG';
                            newUser.LPOTerms = false;
                            newUser.save(function (err) {
                                if(err) throw err;
                                else{
                                    socketResponse(socket, {
                                        module: 'indexResponse',
                                        submodule: 'signUp',
                                        message: newUser
                                    }, null);

                                    var email_to = newUser.email;
                                    var mailOptions = {
                                        from: 'Swiftify',
                                        to: email_to,
                                        subject: 'Success registration to Swiftify✔',
                                        html: 'You have successfully registered to our platform. <br/>Please enter this verification code in order to continue.<br/><strong>' + newUser.status + '</strong>'
                                    };
                                    transporter.sendMail(mailOptions, function (error) {
                                        if (error) {
                                            console.log(error);
                                        }


                                    });
                                }
                            });
                        }
                     });

                     break;
                 case 'logIn':
                      User.findOne({'email': credentials[0]}, function (err, results) {
                          var message;
                          var err;
                         if(err)
                             throw err;
                         else if(!results){
                             err = 'errorEmail';
                             message = 'There is no user with that email';
                         }else{
                             if(results.validPassword(credentials[1])){
                                message = results;
                             }else{
                                 err = 'errorPass';
                                 message = 'Please enter a valid password';
                             }
                         }

                          socketResponse(socket, {
                              module: 'indexResponse',
                              submodule: 'logIn',
                              err: err,
                              message: message
                          }, null);
                      });
                     break;
                 case 'verify':
                     break;
             }
        });

    });
};
function notification(data, socket){
    User.updateOne({'businessName': data.toId},
        {$inc: {'notifications':1}}, function (err) {
        if(err)
            throw err;
    });
    var newNote = new Note();
    newNote.toId = data.toId;
    newNote.from =  data.from;
    newNote.dateCreated = Date.now();
    newNote.serial = data.serial;
    newNote.doc = data.doc;
    newNote.note = data.note;
    newNote.read = false;
    newNote.save(function (err) {
        if(err)
            throw err;
        else{
            data = {
                note: newNote,
                module: 'notification',
                submodule:'newNote'
            };
            socketResponse(socket, data, true);
        }
    })
}
function socketResponse(socket, data, third) {
    socket.emit('serverData', data);
    if(third){
        socket.broadcast.emit('serverData', data);

    }
}
function getTime(){
    var today = new Date();
    var now = Date.now();
    var  date = today.getDate()+'/'+parseInt(today.getMonth()+1)+'/'+ today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    if(hours < 10){
        hours = '0'+hours;
    }else{
        hours = hours;
    }
    if(minutes < 10){
        minutes = '0'+minutes;
    }else{
        minutes = minutes;
    }
    var time = hours + ':'+minutes;
    data = [date, time, now];
    return data;
}
function  changeDate(date){
    var dateString = new Date(date);
    dateString = dateString.toString();
    date = dateString.substr(0, 15);
    var time = dateString.substr(16, 5);
    dateString = date + ' at '+time;
    return dateString;
}