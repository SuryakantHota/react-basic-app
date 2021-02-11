'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import LocationTable from './location-table.js';
import LocationMap from './location-map.js';
import LocationTax from './location-tax.js';
import LocationList from './location-list.js';
import LocationManage from './location-manage.js';
// import styles from './css/root.css';

var _MaterialUI = MaterialUI,
    Modal = _MaterialUI.Modal,
    Backdrop = _MaterialUI.Backdrop,
    Fade = _MaterialUI.Fade,
    Button = _MaterialUI.Button,
    makeStyles = _MaterialUI.makeStyles;

var LocationRoot = function (_React$Component) {
    _inherits(LocationRoot, _React$Component);

    function LocationRoot(props) {
        _classCallCheck(this, LocationRoot);

        var _this = _possibleConstructorReturn(this, (LocationRoot.__proto__ || Object.getPrototypeOf(LocationRoot)).call(this, props));

        _this.state = {
            locations: [],
            formattedLocations: [],
            clickType: '',
            clickedLoc: {},
            context: props.context,
            modalState: false,
            countryName: '',
            pageLdr: false,
            manageLocModal: false,
            manageLocType: null,
            manageLocation: null,
            updatedLoc: null,
            addedLoc: null,
            deletedLoc: null,
            ldrMsg: '',
            highlightLoc: null
        };
        _this.fetchLocations = _this.fetchLocations.bind(_this);
        _this.onContext = _this.onContext.bind(_this);
        _this.tableRowClicked = _this.tableRowClicked.bind(_this);
        _this.manageTaxClicked = _this.manageTaxClicked.bind(_this);
        _this.handleClose = _this.handleClose.bind(_this);
        _this.taxModalClosed = _this.taxModalClosed.bind(_this);
        _this.onNewLocationAdd = _this.onNewLocationAdd.bind(_this);
        _this.onLocationUpdate = _this.onLocationUpdate.bind(_this);
        _this.togglePageLoader = _this.togglePageLoader.bind(_this);
        _this.formatLocationData = _this.formatLocationData.bind(_this);
        _this.handleManageTaxClose = _this.handleManageTaxClose.bind(_this);
        _this.manageLocModalClosed = _this.manageLocModalClosed.bind(_this);
        _this.showLocationModal = _this.showLocationModal.bind(_this);
        _this.manageLocationClicked = _this.manageLocationClicked.bind(_this);
        _this.deleteLocationFromServer = _this.deleteLocationFromServer.bind(_this);
        _this.deleteLocation = _this.deleteLocation.bind(_this);
        return _this;
    }

    _createClass(LocationRoot, [{
        key: 'formatLocationData',
        value: function formatLocationData(locData) {
            var locList = [];
            for (var i = 0; i < locData.length; i++) {
                var locObj = {
                    'id': locData[i]['id'],
                    'name': locData[i]['name'],
                    'ownerName': locData[i]['owner']['displayName'],
                    'lat': locData[i]['latitude'],
                    'lng': locData[i]['longitude'],
                    'textLabel': locData[i]['taxFree'] || !locData[i]['taxTypes'] || locData[i]['taxTypes'].length === 0 ? 'Edit Taxes' : 'Manage Taxes',
                    'taxFree': locData[i]['taxFree'],
                    'taxData': locData[i]['taxTypes'] ? locData[i]['taxTypes'] : [],
                    'uniqueId': locData[i]['id'],
                    'locDataRec': locData[i]
                };
                var addrVal = [locData[i]['city'], locData[i]['state'], locData[i]['country']];
                locObj['address'] = addrVal.join(', ');

                var formattedLocation = [];
                if (locData[i]['addressLine1'] && locData[i]['addressLine1'].length > 0) {
                    formattedLocation.push(locData[i]['addressLine1']);
                }
                if (locData[i]['addressLine2'] && locData[i]['addressLine2'].length > 0) {
                    formattedLocation.push(locData[i]['addressLine2']);
                }
                if (locData[i]['addressLine3'] && locData[i]['addressLine3'].length > 0) {
                    formattedLocation.push(locData[i]['addressLine3']);
                }
                if (locData[i]['city'] && locData[i]['city'].length > 0) {
                    formattedLocation.push(locData[i]['city']);
                }
                if (locData[i]['state'] && locData[i]['state'].length > 0) {
                    formattedLocation.push(locData[i]['state']);
                }
                if (locData[i]['country'] && locData[i]['country'].length > 0) {
                    formattedLocation.push(locData[i]['country']);
                }

                locObj['formattedAddress'] = formattedLocation.join(', ');
                locList.push(locObj);
            }
            console.log('formatLocationData locList', locList);
            return locList;
        }
    }, {
        key: 'fetchLocations',
        value: function fetchLocations() {
            var _this2 = this;

            var prefixURL = Config.path;
            var url = prefixURL + '/locations';
            fetch(url, {
                'method': 'GET',
                'headers': {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(function (resp) {
                if (!resp.ok) {
                    throw new Error('Network response was not ok');
                }
                return resp.json();
            }).then(function (respJson) {
                console.log('fetchLocations respJson', respJson);
                _this2.setState({ locations: respJson });
                var formattedLocations = _this2.formatLocationData(respJson);
                _this2.setState(function (state, props) {
                    return {
                        formattedLocations: formattedLocations
                    };
                });
            }).catch(function (e) {
                console.log('fetchLocations error e', e);
                _this2.setState({ locations: [] });
            });
        }
    }, {
        key: 'onContext',
        value: function onContext(updatedList) {
            console.log('onContext updatedList', updatedList);
            this.setState({ locations: updatedList });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            console.log('Location root component mounted');
            this.fetchLocations();
        }
    }, {
        key: 'handleClose',
        value: function handleClose() {
            this.setState(function (state, props) {
                return {
                    'modalState': false
                };
            });
        }
    }, {
        key: 'handleManageTaxClose',
        value: function handleManageTaxClose() {
            this.setState(function (state, props) {
                return {
                    'manageLocModal': false
                };
            });
        }
    }, {
        key: 'tableRowClicked',
        value: function tableRowClicked(rowObj) {
            console.log('tableRowClicked rowObj', rowObj);
            this.setState({ 'highlightLoc': rowObj });
        }
    }, {
        key: 'manageTaxClicked',
        value: function manageTaxClicked(rowObj) {
            console.log('manageTaxClicked rowObj', rowObj);
            this.setState(function (state, props) {
                return {
                    'modalState': true,
                    'clickedLoc': rowObj,
                    'clickType': 'tax',
                    'countryName': rowObj.address.split(',')[2].trim()
                };
            });
        }
    }, {
        key: 'showLocationModal',
        value: function showLocationModal() {
            this.setState(function () {
                return {
                    'manageLocType': 'add',
                    'manageLocModal': true
                };
            });
        }
    }, {
        key: 'taxModalClosed',
        value: function taxModalClosed(data) {
            var _this3 = this;

            console.log("tax closed data", data);
            this.handleClose();
            function removeDeletedTaxes(targetLoc) {
                if (data['deletedTaxes'].length > 0) {
                    targetLoc['taxData'] = targetLoc['taxData'].filter(function (taxIndv) {
                        return data['deletedTaxes'].indexOf(taxIndv['id']) === -1;
                    });
                }
            }

            if (data && data['status']) {
                var exLoc = this.state.formattedLocations;
                var targetLoc = void 0;
                if (data['taxFreeClose']) {
                    for (var i = 0; i < exLoc.length; i++) {
                        if (exLoc[i]['id'] === data['resourceId']) {
                            targetLoc = JSON.parse(JSON.stringify(exLoc[i]));
                            targetLoc['uniqueId'] = Math.ceil(Math.random() * 1000 + 999);
                            targetLoc['taxFree'] = data['taxFreeResp']['taxFree'];
                            targetLoc['textLabel'] = targetLoc['taxFree'] || !targetLoc['taxData'] || targetLoc['taxData'].length === 0 ? 'Edit Taxes' : 'Manage Taxes';
                            removeDeletedTaxes(targetLoc);
                            exLoc[i] = targetLoc;
                            break;
                        }
                    }
                } else {
                    for (var _i = 0; _i < exLoc.length; _i++) {
                        if (exLoc[_i]['id'] === data['resourceId']) {
                            targetLoc = JSON.parse(JSON.stringify(exLoc[_i]));
                            targetLoc['uniqueId'] = Math.ceil(Math.random() * 1000 + 999);
                            targetLoc['taxData'] = data['resp'];
                            targetLoc['taxFree'] = data['taxFreeResp']['taxFree'];
                            targetLoc['textLabel'] = targetLoc['taxFree'] || !targetLoc['taxData'] || targetLoc['taxData'].length === 0 ? 'Edit Taxes' : 'Manage Taxes';
                            removeDeletedTaxes(targetLoc);
                            exLoc[_i] = targetLoc;
                            break;
                        }
                    }
                }

                console.log('after new loc update targetLoc', targetLoc);

                this.setState(function (state, props) {
                    return {
                        formattedLocations: JSON.parse(JSON.stringify(exLoc)),
                        updatedLoc: targetLoc
                    };
                }, function () {
                    console.log('after new loc update', _this3.state.formattedLocations);
                });
            }
        }
    }, {
        key: 'manageLocModalClosed',
        value: function manageLocModalClosed(data) {
            var _this4 = this;

            console.log('manageLocModalClosed data', data);
            this.handleManageTaxClose();
            if (data['status']) {
                var locData = data['resp'];
                var formattedLocations = this.formatLocationData([locData]);
                var exLoc = JSON.parse(JSON.stringify(this.state.formattedLocations));
                console.log('manageLocModalClosed exLoc', exLoc);

                if (data['type'] === 'add') {
                    exLoc.splice(0, 0, formattedLocations[0]);
                    // exLoc.unshift(formattedLocations[0])
                    this.setState(function (state, props) {
                        return {
                            formattedLocations: exLoc,
                            addedLoc: formattedLocations[0]
                        };
                    }, function () {
                        console.log('after new loc add', _this4.state.formattedLocations);
                    });
                } else {
                    for (var i = 0; i < exLoc.length; i++) {
                        if (exLoc[i]['id'] === formattedLocations[0]['id']) {
                            formattedLocations[0]['uniqueId'] = Math.ceil(Math.random() * 1000 + 999);

                            formattedLocations[0]['textLabel'] = exLoc[i]['textLabel'];
                            formattedLocations[0]['taxFree'] = exLoc[i]['taxFree'];
                            formattedLocations[0]['taxData'] = exLoc[i]['taxData'];

                            exLoc[i] = formattedLocations[0];
                            break;
                        }
                    }
                    this.setState(function (state, props) {
                        return {
                            formattedLocations: JSON.parse(JSON.stringify(exLoc)),
                            updatedLoc: formattedLocations[0]
                        };
                    }, function () {
                        console.log('after new loc update', _this4.state.formattedLocations);
                    });
                }
            }
        }
    }, {
        key: 'onNewLocationAdd',
        value: function onNewLocationAdd() {
            console.log('loc root onNewLocationAdd');
            this.fetchLocations();
        }
    }, {
        key: 'onLocationUpdate',
        value: function onLocationUpdate() {
            console.log('loc root onLocationUpdate');
            this.fetchLocations();
        }
    }, {
        key: 'togglePageLoader',
        value: function togglePageLoader(status, message) {
            this.setState(function (state, props) {
                return {
                    'pageLdr': status,
                    'ldrMsg': message
                };
            });
        }
    }, {
        key: 'manageLocationClicked',
        value: function manageLocationClicked(location) {
            console.log('manageLocationClicked location', location);
            this.setState(function () {
                return {
                    'manageLocType': 'edit',
                    'manageLocModal': true,
                    'manageLocation': location
                };
            });
        }
    }, {
        key: 'deleteLocationFromServer',
        value: function deleteLocationFromServer(locationId) {
            return new Promise(function (resolve, reject) {
                var prefixURL = Config.path;
                var url = prefixURL + '/locations/' + locationId;
                fetch(url, {
                    'method': 'DELETE',
                    'headers': {
                        'Accept': 'application/json'
                    }
                }).then(function (resp) {
                    if (!resp.ok) {
                        throw new Error('Network response was not ok');
                    }
                    // return resp.json();
                }).then(function (respJson) {
                    console.log('deleteLocationFromServer respJson', respJson);
                    resolve();
                }).catch(function (e) {
                    console.log('deleteLocationFromServer error e', e);
                    reject();
                });
            });
        }
    }, {
        key: 'deleteLocation',
        value: function deleteLocation(location) {
            var _this5 = this;

            console.log('deleteLocation location', location);
            this.deleteLocationFromServer(location.id).then(function (resp) {
                console.log('delete success');
                var filteredLocs = _this5.state.formattedLocations.filter(function (loc) {
                    return loc['id'] != location['id'];
                });

                _this5.setState(function (state, props) {
                    return {
                        formattedLocations: filteredLocs,
                        deletedLoc: location
                    };
                });
            }).catch(function (err) {
                console.log('delete fail err', err);
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'col-md-12 col-xs-12 location_root_contnr' },
                React.createElement(
                    'div',
                    { className: 'addloc-btntop', onClick: this.showLocationModal },
                    '  ',
                    React.createElement('i', { 'class': 'fa fa-plus', 'aria-hidden': 'true' }),
                    ' Add Location '
                ),
                React.createElement(
                    'div',
                    { className: 'col-md-4 col-xs-12 pad-0 locRtable' },
                    React.createElement(LocationList, { locations: this.state.formattedLocations, taxClicked: this.manageTaxClicked, rowClicked: this.tableRowClicked, manageLocationClicked: this.manageLocationClicked, deleteLocation: this.deleteLocation })
                ),
                React.createElement(
                    'div',
                    { className: 'col-md-8 col-xs-12 pad-0 locRmap' },
                    React.createElement(LocationMap, { locations: this.state.formattedLocations, deletedLoc: this.state.deletedLoc, addedLoc: this.state.addedLoc, updatedLoc: this.state.updatedLoc, highlightLoc: this.state.highlightLoc })
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Modal,
                        {
                            'aria-labelledby': 'transition-modal-title',
                            'aria-describedby': 'transition-modal-description',
                            className: 'react_root_modal_ele',
                            open: this.state.modalState,
                            onClose: this.handleClose,
                            closeAfterTransition: true,
                            BackdropComponent: Backdrop,
                            BackdropProps: {
                                timeout: 500
                            }
                        },
                        React.createElement(
                            Fade,
                            { 'in': this.state.modalState },
                            React.createElement(
                                'div',
                                { className: 'paper' },
                                React.createElement(LocationTax, { taxModalClosed: this.taxModalClosed, countryName: this.state.countryName, resourceId: this.state.clickedLoc.id, locName: this.state.clickedLoc.name, taxFree: this.state.clickedLoc.taxFree, currLoc: this.state.clickedLoc })
                            )
                        )
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Modal,
                        {
                            'aria-labelledby': 'transition-modal-title',
                            'aria-describedby': 'transition-modal-description',
                            className: 'react_root_modal_ele',
                            open: this.state.manageLocModal,
                            onClose: this.handleManageTaxClose,
                            closeAfterTransition: true,
                            BackdropComponent: Backdrop,
                            BackdropProps: {
                                timeout: 500
                            }
                        },
                        React.createElement(
                            Fade,
                            { 'in': this.state.manageLocModal },
                            React.createElement(
                                'div',
                                { className: 'paper location_manage_modal' },
                                this.state.manageLocModal ? React.createElement(LocationManage, { manageLocModalClosed: this.manageLocModalClosed, location: this.state.manageLocation, type: this.state.manageLocType }) : React.createElement('div', null)
                            )
                        )
                    )
                ),
                this.state.pageLdr && React.createElement('div', { className: 'location_ldr_contnr' })
            );
        }
    }]);

    return LocationRoot;
}(React.Component);

var domContainer = document.querySelector('#react_contnr');
ReactDOM.render(React.createElement(LocationRoot), domContainer);
