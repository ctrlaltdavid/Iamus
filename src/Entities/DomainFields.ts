//   Copyright 2020 Vircadia Contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
'use strict'

import Config from '@Base/config';

import { Entity } from '@Entities/Entity';

import { Maturity } from '@Entities/Sets/Maturity';

import { Perm } from '@Route-Tools/Perm';

import { FieldDefn, ValidateResponse } from '@Route-Tools/EntityFieldDefn';
import { isStringValidator, isNumberValidator, isBooleanValidator, isSArraySet, isDateValidator } from '@Route-Tools/Validators';
import { simpleGetter, simpleSetter, noGetter, noSetter, noOverwriteSetter, sArraySetter, dateStringGetter } from '@Route-Tools/Validators';

import { Logger } from '@Tools/Logging';

export function CheckDomainFields(): void {
  // DEBUG DEBUG: for unknown reasons some field ops end up 'undefined'
  Object.keys(DomainFields).forEach( fieldName => {
    const defn = DomainFields[fieldName];
    if (typeof(defn.validate) !== 'function') {
      Logger.error(`CheckDomainFields: field ${defn.entity_field} validator is not a function`);
    };
    if (typeof(defn.getter) !== 'function') {
      Logger.error(`CheckDomainFields: field ${defn.entity_field} getter is not a function`);
    };
    if (typeof(defn.setter) !== 'function') {
      Logger.error(`CheckDomainFields: field ${defn.entity_field} setter is not a function`);
    };
  });
  // END DEBUG DEBUG
};

/*
// Get the value of a domain field with the fieldname.
// Checks to make sure the getter has permission to get the values.
// Returns the value. Could be 'undefined' whether the requestor doesn't have permissions or that's
//     the actual field value.
export async function getDomainField(pAuthToken: AuthToken, pDomain: DomainEntity,
                                pField: string, pRequestingAccount?: AccountEntity): Promise<any> {
  return getEntityField(DomainFields, pAuthToken, pDomain, pField, pRequestingAccount);
};
// Set a domain field with the fieldname and a value.
// Checks to make sure the setter has permission to set.
// Returns 'true' if the value was set and 'false' if the value could not be set.
export async function setDomainField(pAuthToken: AuthToken,  // authorization for making this change
            pDomain: DomainEntity,              // the domain being changed
            pField: string, pVal: any,          // field being changed and the new value
            pRequestingAccount?: AccountEntity, // Account associated with pAuthToken, if known
            pUpdates?: VKeyedCollection         // where to record updates made (optional)
                    ): Promise<ValidateResponse> {
  return setEntityField(DomainFields, pAuthToken, pDomain, pField, pVal, pRequestingAccount, pUpdates);
};

// Generate an 'update' block for the specified field or fields.
// This is a field/value collection that can be passed to the database routines.
// Note that this directly fetches the field value rather than using 'getter' since
//     we want the actual value (whatever it is) to go into the database.
// If an existing VKeyedCollection is passed, it is added to an returned.
export function getDomainUpdateForField(pDomain: DomainEntity,
              pField: string | string[], pExisting?: VKeyedCollection): VKeyedCollection {
  return getEntityUpdateForField(DomainFields, pDomain, pField, pExisting);
};
*/

// Naming and access for the fields in a DomainEntity.
// Indexed by request_field_name.
export const DomainFields: { [key: string]: FieldDefn } = {
  'id': {
    entity_field: 'id',
    request_field_name: 'id',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'none' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'name': {
    entity_field: 'name',
    request_field_name: 'name',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: async (pField: FieldDefn, pEntity: Entity, pVal: any): Promise<ValidateResponse> => {
      let validity: ValidateResponse;
      if (typeof(pVal) === 'string' && (pVal as string).length > 0) {
        if( /^[A-Za-z][A-Za-z0-9+\-_\.]*$/.test(pVal) ) {
          validity = { valid: true };
        }
        else {
          validity = { valid: false, reason: 'domain name characters must be A-Za-z0-9+-_.'};
        };
      }
      else {
        validity = { valid: false, reason: 'domain name must be a simple string'};
      };
      return validity;
    },
    setter: noOverwriteSetter,
    getter: simpleGetter
  },
  // An alternate way of setting domain name
  'world_name': {
    entity_field: 'name',
    request_field_name: 'world_name',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: async (pField: FieldDefn, pEntity: Entity, pVal: any): Promise<ValidateResponse> => {
      let validity: ValidateResponse;
      if (typeof(pVal) === 'string' && (pVal as string).length > 0) {
        if (/^[A-Za-z][A-Za-z0-9+\-_\.]*$/.test(pVal)) {
          validity = { valid: true };
        }
        else {
          validity = { valid: false, reason: 'domain name characters must be A-Za-z0-9+-_.'};
        };
      }
      else {
        validity = { valid: false, reason: 'domain name must be a simple string'};
      };
      return validity;
    },
    setter: noOverwriteSetter,
    getter: simpleGetter
  },
  'public_key': {
    entity_field: 'publicKey',
    request_field_name: 'public_key',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'sponsor_account_id': {
    entity_field: 'sponsorAccountId',
    request_field_name: 'sponsor_account_id',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'version': {
    entity_field: 'version',
    request_field_name: 'version',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'protocol': {
    entity_field: 'protocol',
    request_field_name: 'protocol',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'network_address': {
    entity_field: 'networkAddr',
    request_field_name: 'network_address',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'network_port': {
    entity_field: 'networkPort',
    request_field_name: 'network_port',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain' ],
    validate: isNumberValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'automatic_networking': {
    entity_field: 'networkingMode',
    request_field_name: 'automatic_networking',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'num_users': {
    entity_field: 'numUsers',
    request_field_name: 'num_users',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'admin' ],
    validate: isNumberValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'num_anon_users': {
    entity_field: 'anonUsers',
    request_field_name: 'num_anon_users',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'admin' ],
    validate: isNumberValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'restricted': {
    entity_field: 'restricted',
    request_field_name: 'restricted',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isBooleanValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'capacity': {
    entity_field: 'capacity',
    request_field_name: 'capacity',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isNumberValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'description': {
    entity_field: 'description',
    request_field_name: 'description',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isStringValidator,
    setter: noOverwriteSetter,
    getter: simpleGetter
  },
  'contact_info': {
    entity_field: 'contactInfo',
    request_field_name: 'contact_info',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isStringValidator,
    setter: noOverwriteSetter,
    getter: simpleGetter
  },
  'thumbnail': {
    entity_field: 'thumbnail',
    request_field_name: 'thumbnail',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isStringValidator,
    setter: noOverwriteSetter,
    getter: simpleGetter
  },
  'images': {
    entity_field: 'images',
    request_field_name: 'images',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isSArraySet,
    setter: sArraySetter,
    getter: simpleGetter
  },
  'maturity': {
    entity_field: 'maturity',
    request_field_name: 'maturity',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: async (pField: FieldDefn, pEntity: Entity, pVal: any): Promise<ValidateResponse> => {
      if(typeof(pVal) === 'string' && Maturity.KnownMaturity(pVal)) {
        return { valid: true };
      }
      return { valid: false, reason: 'not accepted maturity value'};
    },
    setter: simpleSetter,
    getter: simpleGetter
  },
  'restriction': {
    entity_field: 'restriction',
    request_field_name: 'restriction',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'managers': {
    entity_field: 'managers',
    request_field_name: 'managers',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isSArraySet,
    setter: sArraySetter,
    getter: simpleGetter
  },
  'tags': {
    entity_field: 'tags',
    request_field_name: 'tags',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isSArraySet,
    setter: sArraySetter,
    getter: simpleGetter
  },
  // admin stuff
  'addr_of_first_contact': {
    entity_field: 'iPAddrOfFirstContact',
    request_field_name: 'addr_of_first_contact',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'none' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'when_domain_entry_created': {
    entity_field: 'whenCreated',
    request_field_name: 'when_domain_entry_created',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'none' ],
    validate: isDateValidator,
    setter: noSetter,
    getter: dateStringGetter
  },
  'time_of_last_heartbeat': {
    entity_field: 'timeOfLastHeartbeat',
    request_field_name: 'time_of_last_heartbeat',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'none' ],
    validate: isDateValidator,
    setter: noSetter,
    getter: dateStringGetter
  },
  'last_sender_key': {
    entity_field: 'lastSenderKey',
    request_field_name: 'last_sender_key',
    get_permissions: [ Perm.ALL ],
    set_permissions: [ 'none' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  }
};
