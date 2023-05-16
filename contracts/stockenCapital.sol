//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';

contract stockenCapital is  ERC1155Burnable {

    uint public id = 1;
    string private _baseUri;
    string private _contractUri;

    struct Documento {
        uint creationDate;
        uint id;
        uint[] userIds;
        bytes32 hashDocument;
    }
    struct TokenData{
        address creator;
        uint256 idUser;
        Category category;
        bytes32 info;
    }
    enum Category {
        PARTICIPACIONSOCIAL,JUNTA,NOTACONVERTIBLE
    }

    // save all NFT IPFS hashes
    mapping (uint => string) public ipfsHashes;
    mapping (uint => TokenData) public activos;
    mapping (uint=>Documento) public documentos;
    /// userid --> los activos
    mapping (uint=>TokenData[]) public activosByUser;
    /// userid --> los documentos
    mapping (uint=>Documento[]) public documentosByUser;


    //EVENTS
    event newActivo(address creator, uint userId,bytes32 info,Category category, uint id);
    event burnNFT(address creator, uint id);
    event newDocumento(address _owner,uint[] _idUsers,uint _idDocument,bytes32 _hashDocument);

    //MODIFIERS
    modifier onlyOwner(){
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only owner can access");
        _;
    }

    constructor(string memory contractUri) ERC1155(""){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _baseUri = "ipfs://";
        _contractUri = string(abi.encodePacked("ipfs://", contractUri));
    }

    function contractURI() public view returns (string memory) {
        return _contractUri;
    }


    function getActivo(uint256 tokenId) public view returns (TokenData memory){
        return activos[tokenId];
    }
    function getActivosByUser(uint256 _userId) public view returns (TokenData[] memory){
        return activosByUser[_userId];
    }
     function getDocumento(uint256 _documentoID) public view returns (Documento memory){
        return documentos[_documentoID];
    }
    function getDocumentosByUser(uint256 _userId) public view returns (Documento[] memory){
        return documentosByUser[_userId];
    }

    

    
    /**
     * @dev user creates new NFTs
     */
    function createNewActivo(address _owner,uint _idUser, Category _category,bytes32 _info, string memory _ipfshash) public onlyOwner returns (uint){
        _mint(_owner, id, 10**18, "");
        
        ipfsHashes[id] = _ipfshash;
        activos[id] = TokenData({
            creator: _owner,
            category:_category,
            info:_info,
            idUser:_idUser
        });
        activosByUser[_idUser].push(activos[id]);
        emit newActivo(_owner,_idUser,_info,_category, id);
        id++;
        return(id-1);
    }

        /**
     * @dev user creates new NFTs
     */
    function createNewDocumento(address _owner,uint256[] memory _idUsers, bytes32 _hashDocument,uint _idDocument) public onlyOwner returns (uint){
          documentos[_idDocument] = Documento({
            creationDate:block.timestamp,
            hashDocument:_hashDocument,
            id:_idDocument,
            userIds:_idUsers
        });
        for (uint i=0;i<_idUsers.length;i++) {
        documentosByUser[_idUsers[i]].push(documentos[_idDocument]);
        }
        emit newDocumento(_owner,_idUsers,_idDocument,_hashDocument);
        return(_idDocument);
    }
    /**
     * @dev user burns his NFTs
     */
     /// Para que esto funcione hay que alterar burn en ERC1155Burnable (21) y permitir al owner
    function burnIt(address _owner, uint tokenId) public onlyOwner{
        burn(_owner, tokenId, 10**18);

        emit burnNFT(_owner, tokenId);
    }


}