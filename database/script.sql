

create table [social-app-schema].Usuario
(
    idUsuario      int  IDENTITY(1,1) NOT NULL,
    usuario        nvarchar(max),
    nombre         nvarchar(max),
    contrasena     nvarchar(max),
    rutaFotoPerfil nvarchar(max),
    primary key (idUsuario)
)
go

create table [social-app-schema].Publicacion
(
    idPublicacion   int  IDENTITY(1,1) NOT NULL,
    fecha           datetime2,
    descripcion     nvarchar(max),
    rutaFoto        nvarchar(max),
    idUsuario       int,
    primary key (idPublicacion),
    foreign key (idUsuario) references [social-app-schema].Usuario(idUsuario),
)
go

create table [social-app-schema].Amigo
(
    idUsuarioA      int,
    idUsuarioB      int,
    foreign key (idUsuarioA) references [social-app-schema].Usuario(idUsuario),
    foreign key (idUsuarioB) references [social-app-schema].Usuario(idUsuario)
)
go

create table [social-app-schema].SolicitudAmistad
(
    idUsuario                 int,
    idUsuarioSolicitante      int,
    foreign key (idUsuario) references [social-app-schema].Usuario(idUsuario),
    foreign key (idUsuarioSolicitante) references [social-app-schema].Usuario(idUsuario),
)
go
