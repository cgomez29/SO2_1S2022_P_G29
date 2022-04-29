--PROCEDIMIENTO PARA OBTENER AMIGOS DE UN USUARIO
create proc getFriends
    @iduser as int
AS
begin tran
    begin try
        declare @error nvarchar(max)
        declare @existUser int

        select @existUser = count(idUsuario) from [social-app-schema].Usuario where idUsuario = @iduser

        if (@existUser = 0)
            begin
            set @error = 'El usuario del que quiere obtener amigos, no existe'
            print @error
            goto ERROR
            end

        select idUsuario,usuario,nombre,rutaFotoPerfil from [social-app-schema].Amigo
        inner join [social-app-schema].Usuario on idUsuario = Amigo.idUsuarioB
        where idUsuarioA = @iduser
        union
        select idUsuario,usuario,nombre,rutaFotoPerfil  from [social-app-schema].Amigo
        inner join [social-app-schema].Usuario on idUsuario = Amigo.idUsuarioA
        where idUsuarioB = @iduser

        commit
        goto SALIDA

        ERROR:
            rollback tran
        SALIDA:
    end try
    begin catch
        print error_message()
    end catch
;

drop proc getFriends;

exec getFriends 30;

-------------------------------------------------------
--PROCEDIMIENTO PARA ENVIAR SOLICITUD DE AMISTAD
create proc sendFriendRequest
    @iduser int,
    @iduserRequesting int
AS
begin tran
    begin try
        declare @error nvarchar(max)
        declare @requestingiduser int = 0
        declare @aux1 int = 0
        declare @aux2 int = 0
        declare @salida int
        declare @existUser int
        declare @existUserF int
        --usuario que envia solicitud

        select @existUser = count(idUsuario) from [social-app-schema].Usuario where idUsuario = @iduser

        if (@iduser = 0)
            begin
            set @error = 'El usuario que envia solicitud, no existe'
            set @salida = 0
            select 'operacion' = @salida, 'msg' = @error
            goto ERROR
            end

        --usuario que tiene una solicitud

        select @existUserF = count(idUsuario) from [social-app-schema].Usuario where idUsuario = @iduserRequesting

        if (@existUserF = 0)
            begin
            set @error = 'El usuario al que quiere enviar solicitud, no existe'
            set @salida = 0
            select 'operacion' = @salida, 'msg' = @error
            goto ERROR
            end

        select @aux1 = count(@iduser), @aux2 = count(@iduserRequesting) from [social-app-schema].SolicitudAmistad
        where idUsuario = @iduser and idUsuarioSolicitante = @iduserRequesting

        if (@aux1 > 0 and @aux2 > 0)
            begin
                set @error = 'solicitud de amistad ya disponible'
                set @salida = 0
                select 'operacion' = @salida, 'msg' = @error
                goto ERROR
            end

        select @aux1 = count(@iduser), @aux2 = count(@iduserRequesting) from [social-app-schema].SolicitudAmistad
        where idUsuario = @iduserRequesting and idUsuarioSolicitante = @iduser

        if (@aux1 > 0 and @aux2 > 0)
            begin
                set @error = 'solicitud de amistad ya disponible'
                set @salida = 0
                select 'operacion' = @salida, 'msg' = @error
                goto ERROR
            end

        insert into [social-app-schema].SolicitudAmistad values (@iduser,@iduserRequesting)
        set @salida = 1
        select 'operacion' = @salida, 'msg' = 'Solicitud de amistad enviada correctamente'

        commit

        goto SALIDA
        ERROR:
        rollback tran
        SALIDA:
    end try
    begin catch
        print error_message()
    end catch
;

drop proc sendFriendRequest;

insert into [social-app-schema].Usuario values ('hector','Hector Orozco','$2a$10$GWB6DQVu3io1yFrPFvX2qu6Q50wlPPc7vV8YS6eW7MwFsf/lpQU1e','ayd1-practica2/60692552-6653-4324-a56b-97ca5868359c')

exec sendFriendRequest 18,13;

select * from [social-app-schema].Usuario;

delete from [social-app-schema].SolicitudAmistad where idUsuario = 18

select * from [social-app-schema].SolicitudAmistad;

-------------------------------------------------------
--PROCEDIMIENTO PARA OBTENER PERSONAS PARA AGREGAR
//////////////////////////
create proc addFriends
    @iduser int
AS
begin tran
    begin try
        declare @error nvarchar(max)
        declare @existUser int

        select @existUser = count(idUsuario) from [social-app-schema].Usuario where idUsuario = @iduser

        if (@existUser = 0)
            begin
            set @error = 'El usuario del que quiere obtener amigos, no existe'
            print @error
            goto ERROR
            end

        select idUsuario,usuario,nombre,rutaFotoPerfil from [social-app-schema].Usuario
        left join(
                select idUsuario As usu from [social-app-schema].Amigo
                inner join [social-app-schema].Usuario on idUsuario = Amigo.idUsuarioB
                where idUsuarioA = @iduser
                union
                select idUsuario As usu from [social-app-schema].Amigo
                inner join [social-app-schema].Usuario on idUsuario = Amigo.idUsuarioA
                where idUsuarioB = @iduser
        ) friends on Usuario.idUsuario = friends.usu
        where friends.usu is null and idUsuario!= @iduser

        commit

        goto SALIDA
        ERROR:
        rollback tran
        SALIDA:
    end try
    begin catch
        print error_message()
    end catch
;

drop proc addFriends

execute addFriends 30
-------------------------------------------------------
--PROCEDIMIENTO PARA ACEPTAR SOLICITUDES DE AMISTAD
//////////////////////////////////////////////////////////
create proc acceptRequest
    @iduser int,
    @iduserRequesting int
AS
begin tran
    begin try
        declare @error nvarchar(max)
        declare @aux1 int = 0
        declare @aux2 int = 0
        declare @salida int
        declare @existUser int = 0
        declare @existUserF int = 0
        --usuario que envia solicitud

        select @existUser = count(idUsuario) from [social-app-schema].Usuario where idUsuario = @iduser

        if (@existUser = 0)
            begin
            set @error = 'The user does not exist'
            set @salida = 0
            select 'operacion' = @salida, 'msg' = @error
            goto ERROR
            end

        --usuario que tiene una solicitud
        select @existUserF = count(idUsuario) from [social-app-schema].Usuario where idUsuario = 30

        if (@existUserF = 0)
            begin
            set @error = 'The user does not exist.'
            set @salida = 0
            select 'operacion' = @salida, 'msg' = @error
            goto ERROR
            end

        select @aux1 = count(@iduser), @aux2 = count(@iduserRequesting) from [social-app-schema].SolicitudAmistad
        where idUsuario = @iduser and idUsuarioSolicitante = @iduserRequesting or idUsuario = @iduserRequesting and idUsuarioSolicitante = @iduser

        if (@aux1 <> 1 and @aux2 <> 1)
            begin
                set @error = 'Friend request does not exist'
                set @salida = 0
                select 'operacion' = @salida, 'msg' = @error
                goto ERROR
            end

        select @aux1 = count(@iduser), @aux2 = count(@iduserRequesting) from [social-app-schema].Amigo
        where idUsuarioA = @iduser and idUsuarioB = @iduserRequesting or idUsuarioA = @iduserRequesting and idUsuarioB = @iduser

        if (@aux1 > 0 and @aux2 > 0)
            begin
                set @error = 'Friend request not accepted, they are already friends'
                set @salida = 0
                select 'operacion' = @salida, 'msg' = @error
                goto ERROR
            end

        insert into [social-app-schema].Amigo values (@iduser,@iduserRequesting)

        delete from [social-app-schema].SolicitudAmistad where idUsuario = @iduser and idUsuarioSolicitante = @iduserRequesting or idUsuario = @iduserRequesting and idUsuarioSolicitante = @iduser

        set @salida = 1
        select 'operacion' = @salida, 'msg' = 'Accepted friend request'

        commit

        goto SALIDA
        ERROR:
        rollback tran
        SALIDA:
    end try
    begin catch
        print error_message()
    end catch
;

drop proc acceptRequest;
exec acceptRequest 35,18;

-------------------------------------------------------
--PROCEDIMIENTO PARA OBTENER LISTADO DE SOLICITUDES DE AMISTAD
//////////////////////////////////////////////////////

create proc getListRequests
    @iduser as int
AS
begin tran
    begin try
        declare @error nvarchar(max)
        declare @existUser int

        select @existUser = count(idUsuario) from [social-app-schema].Usuario where idUsuario = @iduser

        if (@existUser = 0)
            begin
            set @error = 'El usuario del que quiere obtener amigos, no existe'
            print @error
            goto ERROR
            end

        select  U.idUsuario,U.usuario,U.nombre,U.rutaFotoPerfil from [social-app-schema].SolicitudAmistad
        inner join [social-app-schema].Usuario U on U.idUsuario = SolicitudAmistad.idUsuarioSolicitante
        where SolicitudAmistad.idUsuario = @iduser
        union
        select  U.idUsuario,U.usuario,U.nombre,U.rutaFotoPerfil from [social-app-schema].SolicitudAmistad
        inner join [social-app-schema].Usuario U on U.idUsuario = SolicitudAmistad.idUsuario
        where SolicitudAmistad.idUsuarioSolicitante = @iduser
        commit
        goto SALIDA

        ERROR:
            rollback tran
        SALIDA:
    end try
    begin catch
        print error_message()
    end catch
;

drop proc getListRequests;
select  * from [social-app-schema].Usuario
exec getListRequests 23;