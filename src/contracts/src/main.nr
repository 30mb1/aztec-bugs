mod test_note;



contract Test {
    use dep::std::option::Option;
    use dep::safe_math::SafeU120;

    use dep::value_note::{
        balance_utils,
        utils::{increment, decrement},
        value_note::{VALUE_NOTE_LEN, ValueNote, ValueNoteMethods},
    };
    
    use dep::aztec::{
        abi,
        log::emit_encrypted_log,
        context::{PrivateContext, PublicContext, Context},
        oracle::{
            get_public_key::get_public_key,
        },
        note::{
            note_getter_options::NoteGetterOptions,
            note_header::NoteHeader,
            utils as note_utils
        },
        state_vars::{map::Map, public_state::PublicState, singleton::Singleton, set::Set},
        types::type_serialization::{
            aztec_address_serialization::{AztecAddressSerializationMethods, AZTEC_ADDRESS_SERIALIZED_LEN},
        },
        hash::{compute_secret_hash},
        types::address::{AztecAddress},
        selector::compute_selector,
    };

    use crate::test_note::{TestNote, TEST_NOTE_SERIALIZED_LEN, TestNoteSerializationMethods};

    struct Storage {
        test: Singleton<TestNote, TEST_NOTE_SERIALIZED_LEN>
    }

    impl Storage {
        fn init(context: Context) -> pub Self {
            Storage {
                test: Singleton::new(context, 1, TestNoteSerializationMethods)
            }
        }
    }

    #[aztec(private)]
    fn constructor() {}

    #[aztec(private)]
    fn test() {
        let sender = context.msg_sender();
        let mut test_note = TestNote::new(1, sender);
        storage.test.initialize(&mut test_note, Option::some(sender));
        emit_encrypted_log(
            &mut context,
            context.this_address(),
            storage.test.storage_slot,
            get_public_key(sender),
            test_note.serialize()
        );
        1
    }

    unconstrained fn test_get() -> TestNote {
        storage.test.get_note()
    }


    unconstrained fn compute_note_hash_and_nullifier(contract_address: Field, nonce: Field, storage_slot: Field, preimage: [Field; TEST_NOTE_SERIALIZED_LEN]) -> [Field; 4] {
        let note_header = NoteHeader::new(contract_address, nonce, storage_slot);
        note_utils::compute_note_hash_and_nullifier(TestNoteSerializationMethods, note_header, preimage)
    }
}

